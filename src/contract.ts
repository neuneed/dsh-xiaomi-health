/**
 * Strict Typert wire contract between host runtime and client Web view.
 */
import { z } from 'zod'
import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'

// Zod schemas
export const pluginStatusSchema = z.object({
  isLoggedIn: z.boolean(),
  userId: z.string().nullable(),
  lastSyncTs: z.number().nullable(),
  lastSyncOk: z.boolean(),
  lastError: z.string().nullable(),
  isSyncing: z.boolean(),
  mockMode: z.boolean(),
})

export const heartRateZonesSchema = z.object({
  warmupMinutes: z.number(),
  fatBurnMinutes: z.number(),
  aerobicMinutes: z.number(),
  anaerobicMinutes: z.number(),
  extremeMinutes: z.number(),
})

export const activityGoalsSchema = z.object({
  stepsGoal: z.number(),
  stepsAchieved: z.number(),
  caloriesGoal: z.number(),
  caloriesAchieved: z.number(),
  intensityGoal: z.number(),
  intensityAchieved: z.number(),
})

export const dailyMetricsSchema = z.object({
  date: z.string(),
  steps: z.number().nullable(),
  distanceMeters: z.number().nullable(),
  activityCalories: z.number().nullable(),
  sleepTotalMinutes: z.number().nullable(),
  sleepDeepMinutes: z.number().nullable(),
  sleepLightMinutes: z.number().nullable(),
  sleepRemMinutes: z.number().nullable(),
  sleepAwakeMinutes: z.number().nullable(),
  sleepScore: z.number().nullable(),
  sleepBedtime: z.number().nullable(),
  sleepWakeTime: z.number().nullable(),
  sleepAvgHr: z.number().nullable(),
  sleepAvgSpo2: z.number().nullable(),
  hrAvg: z.number().nullable(),
  hrResting: z.number().nullable(),
  hrMax: z.number().nullable(),
  hrMin: z.number().nullable(),
  hrAbnormalCount: z.number().nullable(),
  hrZones: heartRateZonesSchema,
  hrLatest: z.number().nullable(),
  hrLatestTs: z.number().nullable(),
  spo2Avg: z.number().nullable(),
  spo2Min: z.number().nullable(),
  spo2Max: z.number().nullable(),
  spo2Latest: z.number().nullable(),
  spo2LatestTs: z.number().nullable(),
  intensityMinutes: z.number().nullable(),
  validStandCount: z.number().nullable(),
  goals: activityGoalsSchema,
  source: z.string(),
  updatedAt: z.number(),
})

export const sleepSegmentSchema = z.object({
  id: z.number().optional(),
  date: z.string(),
  kind: z.enum(['main', 'nap']),
  bedtime: z.number(),
  wakeTime: z.number(),
  durationMinutes: z.number(),
  deepMinutes: z.number(),
  lightMinutes: z.number(),
  remMinutes: z.number(),
  awakeMinutes: z.number(),
  awakeCount: z.number(),
  avgHr: z.number().nullable(),
  avgSpo2: z.number().nullable(),
})

export const healthSummarySchema = z.object({
  today: dailyMetricsSchema.nullable(),
  yesterday: dailyMetricsSchema.nullable(),
  healthScore: z.number(),
  insights: z.array(z.string()),
  lastSync: z
    .object({
      timestamp: z.number(),
      ok: z.boolean(),
      error: z.string().nullable(),
    })
    .nullable(),
})

export const syncResultSchema = z.object({
  ok: z.boolean(),
  days: z.number(),
  writtenDays: z.number(),
  error: z.string().optional(),
})

export const dateQuerySchema = z.object({
  days: z.number().optional(),
})

export const sleepQuerySchema = z.object({
  date: z.string(),
})

export const sleepDetailsResultSchema = z.object({
  date: z.string(),
  segments: z.array(sleepSegmentSchema),
  totalDuration: z.number(),
  score: z.number().nullable(),
})

export const mockGenResultSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
})

export const loginInitResultSchema = z.object({
  ok: z.boolean(),
  qrUrl: z.string().optional(),
  loginUrl: z.string().optional(),
  qrBase64: z.string().optional(),
  error: z.string().optional(),
})

const json = (name: string, wire: string, typeSymbol: string, schema: z.ZodType) => ({
  name,
  wire,
  source: 'json' as const,
  codec: { mode: 'strict' as const, typeSymbol, schema },
})

const resultOf = (typeSymbol: string, schema: z.ZodType) => ({
  mode: 'strict' as const,
  typeSymbol,
  schema,
})

export const DSH_HEALTH_INVOCATIONS: readonly InvocationDescriptor[] = [
  {
    id: 'dsh-xiaomi-health#health/getStatus',
    service: 'health',
    namespace: 'health',
    method: 'getStatus',
    invocation: { kind: 'direct' },
    parameters: [],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#PluginStatus', pluginStatusSchema),
  },
  {
    id: 'dsh-xiaomi-health#health/getSummary',
    service: 'health',
    namespace: 'health',
    method: 'getSummary',
    invocation: { kind: 'direct' },
    parameters: [],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#HealthSummary', healthSummarySchema),
  },
  {
    id: 'dsh-xiaomi-health#health/getDailyMetrics',
    service: 'health',
    namespace: 'health',
    method: 'getDailyMetrics',
    invocation: { kind: 'direct' },
    parameters: [json('days', 'days', 'dsh-xiaomi-health#Days', z.number().default(7))],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#DailyMetricsList', z.array(dailyMetricsSchema)),
  },
  {
    id: 'dsh-xiaomi-health#health/getSleepDetails',
    service: 'health',
    namespace: 'health',
    method: 'getSleepDetails',
    invocation: { kind: 'direct' },
    parameters: [json('date', 'date', 'dsh-xiaomi-health#SleepDate', z.string())],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#SleepDetails', sleepDetailsResultSchema),
  },
  {
    id: 'dsh-xiaomi-health#health/syncNow',
    service: 'health',
    namespace: 'health',
    method: 'syncNow',
    invocation: { kind: 'direct' },
    parameters: [json('days', 'days', 'dsh-xiaomi-health#SyncDays', z.number().default(7))],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#SyncResult', syncResultSchema),
  },
  {
    id: 'dsh-xiaomi-health#health/generateMockData',
    service: 'health',
    namespace: 'health',
    method: 'generateMockData',
    invocation: { kind: 'direct' },
    parameters: [json('days', 'days', 'dsh-xiaomi-health#MockDays', z.number().default(14))],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#MockGenResult', mockGenResultSchema),
  },
  {
    id: 'dsh-xiaomi-health#health/startLogin',
    service: 'health',
    namespace: 'health',
    method: 'startLogin',
    invocation: { kind: 'direct' },
    parameters: [],
    cancellation: { parameter: 'signal' },
    result: resultOf('dsh-xiaomi-health#LoginInitResult', loginInitResultSchema),
  },
]
