/**
 * SQLite Database access layer using Node.js built-in node:sqlite.
 */
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { CREATE_TABLES_SQL } from './schema.ts'
import type {
  DailyMetrics,
  SleepSegment,
  SyncRunRecord,
  WeightRecord,
  BloodPressureRecord,
} from '../types.ts'

export class HealthDatabase {
  private db: DatabaseSync

  constructor(filePath: string) {
    if (filePath !== ':memory:') {
      mkdirSync(dirname(filePath), { recursive: true })
    }
    this.db = new DatabaseSync(filePath)
    this.init()
  }

  private init(): void {
    this.db.exec(CREATE_TABLES_SQL)
  }

  public close(): void {
    this.db.close()
  }

  public upsertDailyMetrics(m: DailyMetrics): void {
    const stmt = this.db.prepare(`
      INSERT INTO daily_metrics (
        date, steps, distance_m, activity_calories,
        sleep_total_min, sleep_deep_min, sleep_light_min, sleep_rem_min, sleep_awake_min,
        sleep_score, sleep_bedtime_ts, sleep_wake_ts, sleep_avg_hr, sleep_avg_spo2,
        hr_avg, hr_resting, hr_max, hr_min, hr_abnormal_count,
        hr_zone_warmup_min, hr_zone_fat_burn_min, hr_zone_aerobic_min, hr_zone_anaerobic_min, hr_zone_extreme_min,
        hr_latest, hr_latest_ts,
        spo2_avg, spo2_min, spo2_max, spo2_lack_count, spo2_latest, spo2_latest_ts,
        steps_goal, steps_goal_achieved, calories_goal, calories_goal_achieved,
        intensity_goal, intensity_goal_achieved, intensity_min, valid_stand_count,
        source, updated_at
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
      ON CONFLICT(date) DO UPDATE SET
        steps = excluded.steps,
        distance_m = excluded.distance_m,
        activity_calories = excluded.activity_calories,
        sleep_total_min = excluded.sleep_total_min,
        sleep_deep_min = excluded.sleep_deep_min,
        sleep_light_min = excluded.sleep_light_min,
        sleep_rem_min = excluded.sleep_rem_min,
        sleep_awake_min = excluded.sleep_awake_min,
        sleep_score = excluded.sleep_score,
        sleep_bedtime_ts = excluded.sleep_bedtime_ts,
        sleep_wake_ts = excluded.sleep_wake_ts,
        sleep_avg_hr = excluded.sleep_avg_hr,
        sleep_avg_spo2 = excluded.sleep_avg_spo2,
        hr_avg = excluded.hr_avg,
        hr_resting = excluded.hr_resting,
        hr_max = excluded.hr_max,
        hr_min = excluded.hr_min,
        hr_abnormal_count = excluded.hr_abnormal_count,
        hr_zone_warmup_min = excluded.hr_zone_warmup_min,
        hr_zone_fat_burn_min = excluded.hr_zone_fat_burn_min,
        hr_zone_aerobic_min = excluded.hr_zone_aerobic_min,
        hr_zone_anaerobic_min = excluded.hr_zone_anaerobic_min,
        hr_zone_extreme_min = excluded.hr_zone_extreme_min,
        hr_latest = excluded.hr_latest,
        hr_latest_ts = excluded.hr_latest_ts,
        spo2_avg = excluded.spo2_avg,
        spo2_min = excluded.spo2_min,
        spo2_max = excluded.spo2_max,
        spo2_lack_count = excluded.spo2_lack_count,
        spo2_latest = excluded.spo2_latest,
        spo2_latest_ts = excluded.spo2_latest_ts,
        steps_goal = excluded.steps_goal,
        steps_goal_achieved = excluded.steps_goal_achieved,
        calories_goal = excluded.calories_goal,
        calories_goal_achieved = excluded.calories_goal_achieved,
        intensity_goal = excluded.intensity_goal,
        intensity_goal_achieved = excluded.intensity_goal_achieved,
        intensity_min = excluded.intensity_min,
        valid_stand_count = excluded.valid_stand_count,
        source = excluded.source,
        updated_at = excluded.updated_at
    `)

    stmt.run(
      m.date ?? null,
      m.steps ?? null,
      m.distanceMeters ?? null,
      m.activityCalories ?? null,
      m.sleepTotalMinutes ?? null,
      m.sleepDeepMinutes ?? null,
      m.sleepLightMinutes ?? null,
      m.sleepRemMinutes ?? null,
      m.sleepAwakeMinutes ?? null,
      m.sleepScore ?? null,
      m.sleepBedtime ?? null,
      m.sleepWakeTime ?? null,
      m.sleepAvgHr ?? null,
      m.sleepAvgSpo2 ?? null,
      m.hrAvg ?? null,
      m.hrResting ?? null,
      m.hrMax ?? null,
      m.hrMin ?? null,
      m.hrAbnormalCount ?? 0,
      m.hrZones?.warmupMinutes ?? 0,
      m.hrZones?.fatBurnMinutes ?? 0,
      m.hrZones?.aerobicMinutes ?? 0,
      m.hrZones?.anaerobicMinutes ?? 0,
      m.hrZones?.extremeMinutes ?? 0,
      m.hrLatest ?? null,
      m.hrLatestTs ?? null,
      m.spo2Avg ?? null,
      m.spo2Min ?? null,
      m.spo2Max ?? null,
      (m as any).spo2LackCount ?? null,
      m.spo2Latest ?? null,
      m.spo2LatestTs ?? null,
      m.goals?.stepsGoal ?? 10000,
      m.goals?.stepsAchieved ?? 0,
      m.goals?.caloriesGoal ?? 500,
      m.goals?.caloriesAchieved ?? 0,
      m.goals?.intensityGoal ?? 30,
      m.goals?.intensityAchieved ?? 0,
      m.intensityMinutes ?? null,
      m.validStandCount ?? null,
      m.source ?? 'xiaomi',
      m.updatedAt ?? Math.floor(Date.now() / 1000),
    )
  }

  public upsertSleepSegment(seg: SleepSegment): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO sleep_segments (
        date, kind, bedtime_ts, wake_ts, duration_min,
        deep_min, light_min, rem_min, awake_min, awake_count,
        avg_hr, avg_spo2, max_hr, min_hr, max_spo2, min_spo2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      seg.date ?? null,
      seg.kind ?? 'main',
      seg.bedtime ?? null,
      seg.wakeTime ?? null,
      seg.durationMinutes ?? null,
      seg.deepMinutes ?? null,
      seg.lightMinutes ?? null,
      seg.remMinutes ?? null,
      seg.awakeMinutes ?? null,
      seg.awakeCount ?? null,
      seg.avgHr ?? null,
      seg.avgSpo2 ?? null,
      null,
      null,
      null,
      null,
    )
  }

  public getDailyMetrics(startDate: string, endDate: string): DailyMetrics[] {
    const stmt = this.db.prepare(`
      SELECT * FROM daily_metrics
      WHERE date >= ? AND date <= ?
      ORDER BY date ASC
    `)
    const rows = stmt.all(startDate, endDate) as Record<string, unknown>[]
    return rows.map(mapRowToDailyMetrics)
  }

  public getLatestDailyMetrics(): DailyMetrics | null {
    const stmt = this.db.prepare(`
      SELECT * FROM daily_metrics
      ORDER BY date DESC
      LIMIT 1
    `)
    const rows = stmt.all() as Record<string, unknown>[]
    if (rows.length === 0 || !rows[0]) return null
    return mapRowToDailyMetrics(rows[0])
  }

  public getSleepSegments(date: string): SleepSegment[] {
    const stmt = this.db.prepare(`
      SELECT * FROM sleep_segments
      WHERE date = ?
      ORDER BY bedtime_ts ASC
    `)
    const rows = stmt.all(date) as Record<string, unknown>[]
    return rows.map((r) => ({
      id: Number(r.id),
      date: String(r.date),
      kind: (r.kind as 'main' | 'nap') || 'main',
      bedtime: Number(r.bedtime_ts || 0),
      wakeTime: Number(r.wake_ts || 0),
      durationMinutes: Number(r.duration_min || 0),
      deepMinutes: Number(r.deep_min || 0),
      lightMinutes: Number(r.light_min || 0),
      remMinutes: Number(r.rem_min || 0),
      awakeMinutes: Number(r.awake_min || 0),
      awakeCount: Number(r.awake_count || 0),
      avgHr: r.avg_hr !== null && r.avg_hr !== undefined ? Number(r.avg_hr) : null,
      avgSpo2: r.avg_spo2 !== null && r.avg_spo2 !== undefined ? Number(r.avg_spo2) : null,
    }))
  }

  public recordSyncRun(
    startedAt: number,
    finishedAt: number | null,
    ok: boolean,
    error: string | null,
    daysRequested: number,
    targetUid: string | null,
  ): number {
    const stmt = this.db.prepare(`
      INSERT INTO sync_runs (started_at, finished_at, ok, error, days_requested, target_uid)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const res = stmt.run(startedAt, finishedAt, ok ? 1 : 0, error, daysRequested, targetUid)
    return Number(res.lastInsertRowid)
  }

  public getLastSyncRun(): SyncRunRecord | null {
    const stmt = this.db.prepare(`
      SELECT * FROM sync_runs
      ORDER BY started_at DESC
      LIMIT 1
    `)
    const rows = stmt.all() as Record<string, unknown>[]
    if (rows.length === 0 || !rows[0]) return null
    const r = rows[0]
    return {
      id: Number(r.id),
      startedAt: Number(r.started_at),
      finishedAt: r.finished_at ? Number(r.finished_at) : null,
      ok: Boolean(r.ok),
      error: r.error ? String(r.error) : null,
      daysRequested: Number(r.days_requested || 0),
      targetUid: r.target_uid ? String(r.target_uid) : null,
    }
  }

  public getWeightLogs(limit = 30): WeightRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM weight_log
      ORDER BY time DESC
      LIMIT ?
    `)
    const rows = stmt.all(limit) as Record<string, unknown>[]
    return rows.map((r) => ({
      time: Number(r.time),
      weight: Number(r.weight),
      bmi: r.bmi !== null && r.bmi !== undefined ? Number(r.bmi) : null,
      bodyFatRate: r.body_fat_rate !== null && r.body_fat_rate !== undefined ? Number(r.body_fat_rate) : null,
      source: String(r.source || 'xiaomi'),
    }))
  }

  public getBloodPressureLogs(limit = 30): BloodPressureRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM blood_pressure
      ORDER BY time DESC
      LIMIT ?
    `)
    const rows = stmt.all(limit) as Record<string, unknown>[]
    return rows.map((r) => ({
      time: Number(r.time),
      systolic: Number(r.systolic),
      diastolic: Number(r.diastolic),
      pulse: r.pulse !== null && r.pulse !== undefined ? Number(r.pulse) : null,
      source: String(r.source || 'xiaomi'),
    }))
  }
}

function mapRowToDailyMetrics(r: Record<string, unknown>): DailyMetrics {
  return {
    date: String(r.date),
    steps: r.steps !== null && r.steps !== undefined ? Number(r.steps) : null,
    distanceMeters: r.distance_m !== null && r.distance_m !== undefined ? Number(r.distance_m) : null,
    activityCalories: r.activity_calories !== null && r.activity_calories !== undefined ? Number(r.activity_calories) : null,
    sleepTotalMinutes: r.sleep_total_min !== null && r.sleep_total_min !== undefined ? Number(r.sleep_total_min) : null,
    sleepDeepMinutes: r.sleep_deep_min !== null && r.sleep_deep_min !== undefined ? Number(r.sleep_deep_min) : null,
    sleepLightMinutes: r.sleep_light_min !== null && r.sleep_light_min !== undefined ? Number(r.sleep_light_min) : null,
    sleepRemMinutes: r.sleep_rem_min !== null && r.sleep_rem_min !== undefined ? Number(r.sleep_rem_min) : null,
    sleepAwakeMinutes: r.sleep_awake_min !== null && r.sleep_awake_min !== undefined ? Number(r.sleep_awake_min) : null,
    sleepScore: r.sleep_score !== null && r.sleep_score !== undefined ? Number(r.sleep_score) : null,
    sleepBedtime: r.sleep_bedtime_ts !== null && r.sleep_bedtime_ts !== undefined ? Number(r.sleep_bedtime_ts) : null,
    sleepWakeTime: r.sleep_wake_ts !== null && r.sleep_wake_ts !== undefined ? Number(r.sleep_wake_ts) : null,
    sleepAvgHr: r.sleep_avg_hr !== null && r.sleep_avg_hr !== undefined ? Number(r.sleep_avg_hr) : null,
    sleepAvgSpo2: r.sleep_avg_spo2 !== null && r.sleep_avg_spo2 !== undefined ? Number(r.sleep_avg_spo2) : null,
    hrAvg: r.hr_avg !== null && r.hr_avg !== undefined ? Number(r.hr_avg) : null,
    hrResting: r.hr_resting !== null && r.hr_resting !== undefined ? Number(r.hr_resting) : null,
    hrMax: r.hr_max !== null && r.hr_max !== undefined ? Number(r.hr_max) : null,
    hrMin: r.hr_min !== null && r.hr_min !== undefined ? Number(r.hr_min) : null,
    hrAbnormalCount: r.hr_abnormal_count !== null && r.hr_abnormal_count !== undefined ? Number(r.hr_abnormal_count) : 0,
    hrZones: {
      warmupMinutes: Number(r.hr_zone_warmup_min || 0),
      fatBurnMinutes: Number(r.hr_zone_fat_burn_min || 0),
      aerobicMinutes: Number(r.hr_zone_aerobic_min || 0),
      anaerobicMinutes: Number(r.hr_zone_anaerobic_min || 0),
      extremeMinutes: Number(r.hr_zone_extreme_min || 0),
    },
    hrLatest: r.hr_latest !== null && r.hr_latest !== undefined ? Number(r.hr_latest) : null,
    hrLatestTs: r.hr_latest_ts !== null && r.hr_latest_ts !== undefined ? Number(r.hr_latest_ts) : null,
    spo2Avg: r.spo2_avg !== null && r.spo2_avg !== undefined ? Number(r.spo2_avg) : null,
    spo2Min: r.spo2_min !== null && r.spo2_min !== undefined ? Number(r.spo2_min) : null,
    spo2Max: r.spo2_max !== null && r.spo2_max !== undefined ? Number(r.spo2_max) : null,
    spo2Latest: r.spo2_latest !== null && r.spo2_latest !== undefined ? Number(r.spo2_latest) : null,
    spo2LatestTs: r.spo2_latest_ts !== null && r.spo2_latest_ts !== undefined ? Number(r.spo2_latest_ts) : null,
    intensityMinutes: r.intensity_min !== null && r.intensity_min !== undefined ? Number(r.intensity_min) : null,
    validStandCount: r.valid_stand_count !== null && r.valid_stand_count !== undefined ? Number(r.valid_stand_count) : null,
    goals: {
      stepsGoal: Number(r.steps_goal || 8000),
      stepsAchieved: Number(r.steps_goal_achieved || r.steps || 0),
      caloriesGoal: Number(r.calories_goal || 500),
      caloriesAchieved: Number(r.calories_goal_achieved || r.activity_calories || 0),
      intensityGoal: Number(r.intensity_goal || 30),
      intensityAchieved: Number(r.intensity_goal_achieved || r.intensity_min || 0),
    },
    source: String(r.source || 'xiaomi'),
    updatedAt: Number(r.updated_at || 0),
  }
}
