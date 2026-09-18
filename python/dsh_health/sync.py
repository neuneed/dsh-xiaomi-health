"""Xiaomi Health (Mi Fitness) sync logic: Cloud API → SQLite.

Based on ridd1ot/xiaomi-health-sync with robust error handling and endpoint patching.
"""
from __future__ import annotations

import asyncio
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dsh_health.storage import connect, init_db, upsert_daily


def _patch_paths(family_mode: bool) -> None:
    """Patch mi_fitness client endpoint paths.

    family_mode=True  -> /app/v1/relatives/* (Family account share)
    family_mode=False -> /app/v1/data/* (Own account UID endpoint)
    """
    try:
        from mi_fitness.client import data as _data

        if family_mode:
            _data.RELATIVES_AGGREGATED_DATA_PATH = "/app/v1/relatives/get_aggregated_data"
            _data.RELATIVES_LATEST_DATA_PATH = "/app/v1/relatives/get_latest_data"
            _data.RELATIVES_FITNESS_DATA_PATH = "/app/v1/relatives/get_fitness_data"
        else:
            _data.RELATIVES_AGGREGATED_DATA_PATH = "/app/v1/data/get_aggregated_fitness_data_by_time"
            _data.RELATIVES_LATEST_DATA_PATH = "/app/v1/data/get_latest_fitness_data"
            _data.RELATIVES_FITNESS_DATA_PATH = "/app/v1/data/get_fitness_data_by_time"
    except Exception:
        pass


def _date_from_ts(ts: int | float | None) -> str | None:
    if not ts:
        return None
    try:
        return datetime.fromtimestamp(int(ts), tz=timezone.utc).date().isoformat()
    except (ValueError, OSError):
        return None


def _latest_val(latest: Any) -> tuple[float | None, int | None]:
    if latest is None:
        return None, None
    val = getattr(latest, "bpm", None)
    if val is None:
        val = getattr(latest, "spo2", None)
    ts = getattr(latest, "time", None)
    return (float(val) if val is not None else None), (int(ts) if ts else None)


async def run_sync(
    db_path: Path | str,
    token_path: Path | str,
    *,
    days: int = 7,
    target_uid: int | None = None,
    base_url: str | None = None,
    family_mode: bool = False,
) -> dict[str, Any]:
    db_path = Path(db_path)
    token_path = Path(token_path)

    init_db(db_path)
    if not token_path.exists():
        return {
            "ok": False,
            "error": f"Token file not found: {token_path}. Please login via QR code first.",
        }

    try:
        from mi_fitness import MiHealthClient, TokenExpiredError
        from mi_fitness.auth.sts import sts_exchange
    except ImportError:
        return {
            "ok": False,
            "error": "mi-fitness library is not installed. Run: pip install mi-fitness",
        }

    _patch_paths(family_mode)

    token_data = json.loads(token_path.read_text(encoding="utf-8"))
    uid = target_uid or int(token_data.get("user_id") or 0)
    if not uid:
        return {"ok": False, "error": "No user_id found in token and no target_uid provided."}

    days = max(1, int(days))
    started = int(time.time())
    counters = {
        k: 0
        for k in (
            "steps",
            "sleep",
            "heart_rate",
            "spo2",
            "calories",
            "intensity",
            "valid_stand",
            "weight",
            "segments",
            "goal",
            "days_written",
        )
    }

    with connect(db_path) as conn:
        conn.execute(
            "INSERT INTO sync_runs (started_at, days_requested, target_uid) VALUES (?, ?, ?)",
            (started, days, str(uid)),
        )
        run_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
        conn.commit()

    by_date: dict[str, dict[str, Any]] = {}
    client_kwargs: dict[str, Any] = {}
    if base_url:
        client_kwargs["base_url"] = base_url

    try:
        async with MiHealthClient.from_token(token_path, **client_kwargs) as client:
            # STS exchange to refresh token
            try:
                await sts_exchange(client.auth._ensure_http(), client.auth.token)
                client.auth.save_token(token_path)
            except Exception:
                pass

            # Steps
            try:
                steps = await client.get_steps(uid, days=days)
                for item in steps:
                    d = _date_from_ts(item.time)
                    if not d:
                        continue
                    row = by_date.setdefault(d, {})
                    row["steps"] = int(item.steps) if item.steps is not None else None
                    row["distance_m"] = float(item.distance) if item.distance is not None else None
                    row["activity_calories"] = float(item.calories) if item.calories is not None else None
                    counters["steps"] += 1
            except Exception:
                pass

            # Sleep
            try:
                sleep_list = await client.get_sleep(uid, days=days)
                for sleep in sleep_list:
                    d = _date_from_ts(sleep.time)
                    if not d:
                        continue
                    segs = sleep.segment_details or []
                    main_seg = None
                    bedtime = wake = None
                    if segs:
                        main_seg = max(segs, key=lambda s: (getattr(s, "duration", 0) or 0))
                        bedtime = getattr(main_seg, "bedtime", None)
                        wake = getattr(main_seg, "wake_up_time", None)

                    row = by_date.setdefault(d, {})
                    row["sleep_total_min"] = sleep.total_duration
                    row["sleep_deep_min"] = sleep.sleep_deep_duration
                    row["sleep_light_min"] = sleep.sleep_light_duration
                    row["sleep_rem_min"] = sleep.sleep_rem_duration
                    row["sleep_awake_min"] = sleep.sleep_awake_duration
                    row["sleep_score"] = sleep.sleep_score
                    row["sleep_bedtime_ts"] = bedtime
                    row["sleep_wake_ts"] = wake
                    row["sleep_avg_hr"] = float(sleep.avg_hr) if sleep.avg_hr else None
                    row["sleep_avg_spo2"] = float(sleep.avg_spo2) if sleep.avg_spo2 else None
                    counters["sleep"] += 1

                    # Segments table
                    with connect(db_path) as conn:
                        for seg in segs:
                            dur = getattr(seg, "duration", 0) or 0
                            kind = "main" if seg is main_seg else "nap"
                            conn.execute(
                                """INSERT OR REPLACE INTO sleep_segments
                                (date, kind, bedtime_ts, wake_ts, duration_min, deep_min, light_min,
                                 rem_min, awake_min, awake_count, avg_hr, avg_spo2, max_hr, min_hr, max_spo2, min_spo2)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                                (
                                    d,
                                    kind,
                                    getattr(seg, "bedtime", None),
                                    getattr(seg, "wake_up_time", None),
                                    dur,
                                    getattr(seg, "sleep_deep_duration", None),
                                    getattr(seg, "sleep_light_duration", None),
                                    getattr(seg, "sleep_rem_duration", None),
                                    getattr(seg, "sleep_awake_duration", None),
                                    getattr(seg, "awake_count", None),
                                    getattr(seg, "avg_hr", None),
                                    getattr(seg, "avg_spo2", None),
                                    getattr(seg, "max_hr", None),
                                    getattr(seg, "min_hr", None),
                                    getattr(seg, "max_spo2", None),
                                    getattr(seg, "min_spo2", None),
                                ),
                            )
                        conn.commit()
                    counters["segments"] += len(segs)
            except Exception:
                pass

            # Heart Rate
            try:
                hr_list = await client.get_heart_rate(uid, days=days)
                for hr in hr_list:
                    d = _date_from_ts(hr.time)
                    if not d:
                        continue
                    row = by_date.setdefault(d, {})
                    row["hr_avg"] = float(hr.avg_hr) if hr.avg_hr else None
                    row["hr_resting"] = float(hr.avg_rhr) if hr.avg_rhr else None
                    row["hr_max"] = float(hr.max_hr) if hr.max_hr else None
                    row["hr_min"] = float(hr.min_hr) if hr.min_hr else None
                    row["hr_abnormal_count"] = int(hr.abnormal_hr_count) if hr.abnormal_hr_count is not None else 0
                    row["hr_zone_warmup_min"] = float(hr.warm_up_hr_zone_duration) if hr.warm_up_hr_zone_duration is not None else 0
                    row["hr_zone_fat_burn_min"] = float(hr.fat_burning_hr_zone_duration) if hr.fat_burning_hr_zone_duration is not None else 0
                    row["hr_zone_aerobic_min"] = float(hr.aerobic_hr_zone_duration) if hr.aerobic_hr_zone_duration is not None else 0
                    row["hr_zone_anaerobic_min"] = float(hr.anaerobic_hr_zone_duration) if hr.anaerobic_hr_zone_duration is not None else 0
                    row["hr_zone_extreme_min"] = float(hr.extreme_hr_zone_duration) if hr.extreme_hr_zone_duration is not None else 0
                    lat_bpm, lat_ts = _latest_val(hr.latest_hr)
                    row["hr_latest"] = lat_bpm
                    row["hr_latest_ts"] = lat_ts
                    counters["heart_rate"] += 1
            except Exception:
                pass

            # SpO2
            try:
                spo2_list = await client.get_spo2_history(uid, days=days)
                for spo2 in spo2_list:
                    d = _date_from_ts(spo2.time)
                    if not d:
                        continue
                    row = by_date.setdefault(d, {})
                    row["spo2_avg"] = float(spo2.avg_spo2) if spo2.avg_spo2 else None
                    row["spo2_min"] = float(spo2.min_spo2) if spo2.min_spo2 else None
                    row["spo2_max"] = float(spo2.max_spo2) if spo2.max_spo2 else None
                    lat_spo2, lat_ts2 = _latest_val(spo2.latest_spo2)
                    row["spo2_latest"] = lat_spo2
                    row["spo2_latest_ts"] = lat_ts2
                    counters["spo2"] += 1
            except Exception:
                pass

            # Intensity & Valid Stand
            try:
                intensity_list = await client.get_intensity_history(uid, days=days)
                for item in intensity_list:
                    d = _date_from_ts(item.time)
                    if d:
                        by_date.setdefault(d, {})["intensity_min"] = int(item.duration) if item.duration else None
                        counters["intensity"] += 1
            except Exception:
                pass

            try:
                stand_list = await client.get_valid_stand_history(uid, days=days)
                for item in stand_list:
                    d = _date_from_ts(item.time)
                    if d:
                        by_date.setdefault(d, {})["valid_stand_count"] = int(item.count) if item.count else None
                        counters["valid_stand"] += 1
            except Exception:
                pass

            # Latest goal & snapshot
            try:
                items = await client.get_latest_items(uid)
                for it in items:
                    key = getattr(it, "key", None)
                    v = json.loads(it.value) if isinstance(it.value, str) else (it.value or {})
                    if key == "goal":
                        d = _date_from_ts(v.get("date_time") or it.time)
                        if d:
                            row = by_date.setdefault(d, {})
                            for gi in v.get("goal_items", []):
                                f = gi.get("field")
                                if f == 1:
                                    row["steps_goal"] = gi.get("target_value")
                                    row["steps_goal_achieved"] = gi.get("achieved_value")
                                elif f == 2:
                                    row["calories_goal"] = gi.get("target_value")
                                    row["calories_goal_achieved"] = gi.get("achieved_value")
                                elif f == 4:
                                    row["intensity_goal"] = gi.get("target_value")
                                    row["intensity_goal_achieved"] = gi.get("achieved_value")
                            counters["goal"] += 1
            except Exception:
                pass

        # Write to SQLite
        now = int(time.time())
        with connect(db_path) as conn:
            for day, fields in by_date.items():
                upsert_daily(conn, day, fields)
                counters["days_written"] += 1
            conn.execute(
                "UPDATE sync_runs SET finished_at=?, ok=1, error=NULL WHERE id=?",
                (now, run_id),
            )
            conn.commit()

        return {
            "ok": True,
            "days": days,
            "target_uid": str(uid),
            "counters": counters,
        }

    except TokenExpiredError as exc:
        err = f"TokenExpiredError: {exc}. Please login via QR code again."
        _fail_run(db_path, run_id, err)
        return {"ok": False, "error": err}
    except Exception as exc:
        err = f"{type(exc).__name__}: {exc}"
        _fail_run(db_path, run_id, err)
        return {"ok": False, "error": err}


def _fail_run(db_path: Path, run_id: int, error: str) -> None:
    try:
        with connect(db_path) as conn:
            conn.execute(
                "UPDATE sync_runs SET finished_at=?, ok=0, error=? WHERE id=?",
                (int(time.time()), error, run_id),
            )
            conn.commit()
    except Exception:
        pass
