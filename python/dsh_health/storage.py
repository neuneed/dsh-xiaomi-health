"""SQLite storage operations for Xiaomi Health metrics in Python."""
from __future__ import annotations

import sqlite3
import time
from pathlib import Path
from typing import Any

SCHEMA = """
CREATE TABLE IF NOT EXISTS daily_metrics (
    date TEXT PRIMARY KEY,
    steps INTEGER,
    distance_m REAL,
    activity_calories REAL,
    sleep_total_min INTEGER,
    sleep_deep_min INTEGER,
    sleep_light_min INTEGER,
    sleep_rem_min INTEGER,
    sleep_awake_min INTEGER,
    sleep_score INTEGER,
    sleep_bedtime_ts INTEGER,
    sleep_wake_ts INTEGER,
    sleep_avg_hr REAL,
    sleep_avg_spo2 REAL,
    hr_avg REAL,
    hr_resting REAL,
    hr_max REAL,
    hr_min REAL,
    hr_abnormal_count INTEGER,
    hr_zone_warmup_min REAL,
    hr_zone_fat_burn_min REAL,
    hr_zone_aerobic_min REAL,
    hr_zone_anaerobic_min REAL,
    hr_zone_extreme_min REAL,
    hr_latest REAL,
    hr_latest_ts INTEGER,
    spo2_avg REAL,
    spo2_min REAL,
    spo2_max REAL,
    spo2_lack_count INTEGER,
    spo2_latest REAL,
    spo2_latest_ts INTEGER,
    sleep_stage INTEGER,
    sleep_eval_night INTEGER,
    sleep_eval_day INTEGER,
    sleep_max_hr REAL,
    sleep_min_hr REAL,
    sleep_max_spo2 REAL,
    sleep_min_spo2 REAL,
    stress_avg REAL,
    stress_min REAL,
    stress_max REAL,
    stress_relax_min REAL,
    stress_mild_min REAL,
    stress_moderate_min REAL,
    stress_severe_min REAL,
    steps_goal INTEGER,
    steps_goal_achieved INTEGER,
    calories_goal INTEGER,
    calories_goal_achieved INTEGER,
    intensity_goal INTEGER,
    intensity_goal_achieved INTEGER,
    intensity_min INTEGER,
    valid_stand_count INTEGER,
    source TEXT NOT NULL DEFAULT 'xiaomi',
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sleep_segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'main',
    bedtime_ts INTEGER,
    wake_ts INTEGER,
    duration_min INTEGER,
    deep_min INTEGER,
    light_min INTEGER,
    rem_min INTEGER,
    awake_min INTEGER,
    awake_count INTEGER,
    avg_hr REAL,
    avg_spo2 REAL,
    max_hr REAL,
    min_hr REAL,
    max_spo2 REAL,
    min_spo2 REAL,
    UNIQUE(date, bedtime_ts, wake_ts)
);

CREATE TABLE IF NOT EXISTS sync_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at INTEGER NOT NULL,
    finished_at INTEGER,
    ok INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    days_requested INTEGER,
    target_uid TEXT
);

CREATE TABLE IF NOT EXISTS weight_log (
    time INTEGER PRIMARY KEY,
    weight REAL,
    bmi REAL,
    body_fat_rate REAL,
    source TEXT NOT NULL DEFAULT 'xiaomi'
);

CREATE TABLE IF NOT EXISTS blood_pressure (
    time INTEGER PRIMARY KEY,
    systolic INTEGER,
    diastolic INTEGER,
    pulse INTEGER,
    source TEXT NOT NULL DEFAULT 'xiaomi'
);
"""


def connect(db_path: Path | str) -> sqlite3.Connection:
    p = Path(db_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(p), timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: Path | str) -> None:
    with connect(db_path) as conn:
        conn.executescript(SCHEMA)
        conn.commit()


def upsert_daily(conn: sqlite3.Connection, date: str, fields: dict[str, Any]) -> None:
    if not fields:
        return
    fields = dict(fields)
    fields["updated_at"] = int(time.time())

    cols = ["date"] + list(fields.keys())
    placeholders = ["?"] * len(cols)
    vals = [date] + list(fields.values())

    update_clauses = [f"{col} = excluded.{col}" for col in fields.keys()]
    sql = f"""
    INSERT INTO daily_metrics ({', '.join(cols)})
    VALUES ({', '.join(placeholders)})
    ON CONFLICT(date) DO UPDATE SET
      {', '.join(update_clauses)}
    """
    conn.execute(sql, vals)
