/**
 * Shared domain models and interfaces for dsh-xiaomi-health.
 */

export interface HeartRateZones {
  warmupMinutes: number
  fatBurnMinutes: number
  aerobicMinutes: number
  anaerobicMinutes: number
  extremeMinutes: number
}

export interface ActivityGoals {
  stepsGoal: number
  stepsAchieved: number
  caloriesGoal: number
  caloriesAchieved: number
  intensityGoal: number
  intensityAchieved: number
}

export interface DailyMetrics {
  date: string // YYYY-MM-DD
  steps: number | null
  distanceMeters: number | null
  activityCalories: number | null
  sleepTotalMinutes: number | null
  sleepDeepMinutes: number | null
  sleepLightMinutes: number | null
  sleepRemMinutes: number | null
  sleepAwakeMinutes: number | null
  sleepScore: number | null
  sleepBedtime: number | null
  sleepWakeTime: number | null
  sleepAvgHr: number | null
  sleepAvgSpo2: number | null
  hrAvg: number | null
  hrResting: number | null
  hrMax: number | null
  hrMin: number | null
  hrAbnormalCount: number | null
  hrZones: HeartRateZones
  hrLatest: number | null
  hrLatestTs: number | null
  spo2Avg: number | null
  spo2Min: number | null
  spo2Max: number | null
  spo2Latest: number | null
  spo2LatestTs: number | null
  intensityMinutes: number | null
  validStandCount: number | null
  goals: ActivityGoals
  source: string
  updatedAt: number
}

export interface SleepSegment {
  id?: number
  date: string
  kind: 'main' | 'nap'
  bedtime: number
  wakeTime: number
  durationMinutes: number
  deepMinutes: number
  lightMinutes: number
  remMinutes: number
  awakeMinutes: number
  awakeCount: number
  avgHr: number | null
  avgSpo2: number | null
}

export interface WeightRecord {
  time: number
  weight: number
  bmi: number | null
  bodyFatRate: number | null
  source: string
}

export interface BloodPressureRecord {
  time: number
  systolic: number
  diastolic: number
  pulse: number | null
  source: string
}

export interface SyncRunRecord {
  id?: number
  startedAt: number
  finishedAt: number | null
  ok: boolean
  error: string | null
  daysRequested: number
  targetUid: string | null
}

export interface HealthSummary {
  today: DailyMetrics | null
  yesterday: DailyMetrics | null
  healthScore: number
  insights: string[]
  lastSync: {
    timestamp: number
    ok: boolean
    error: string | null
  } | null
}

export interface PluginStatus {
  isLoggedIn: boolean
  userId: string | null
  lastSyncTs: number | null
  lastSyncOk: boolean
  lastError: string | null
  isSyncing: boolean
  mockMode: boolean
}

export interface LoginSession {
  sessionId: string
  qrImageUrl: string
  loginUrl: string
  qrImageBase64?: string
  status: 'pending' | 'scanned' | 'confirmed' | 'expired' | 'error'
  userId?: string
  error?: string
}

export interface SyncResult {
  ok: boolean
  days: number
  writtenDays: number
  error?: string
}

/** Configuration interface resolved from Cordis schema. */
export interface ResolvedConfig {
  dbPath: string
  tokenPath: string
  enableAutoSync: boolean
  syncIntervalMinutes: number
  mockMode: boolean
  familyMode: boolean
  targetUid?: string
  pythonPath?: string
}
