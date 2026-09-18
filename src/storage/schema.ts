/**
 * SQLite Database schema matching the Xiaomi Health (Mi Fitness) sync structure.
 */

export const CREATE_TABLES_SQL = `
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

CREATE INDEX IF NOT EXISTS idx_sleep_date ON sleep_segments(date);
CREATE INDEX IF NOT EXISTS idx_sync_started ON sync_runs(started_at DESC);
`;
