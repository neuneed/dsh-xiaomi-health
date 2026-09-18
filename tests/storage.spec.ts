import { describe, expect, it } from 'vitest'
import { HealthDatabase } from '../src/storage/db.ts'
import type { DailyMetrics, SleepSegment } from '../src/types.ts'

describe('HealthDatabase', () => {
  it('initializes in-memory tables and performs basic operations', () => {
    const db = new HealthDatabase(':memory:')

    const sampleMetrics: DailyMetrics = {
      date: '2026-09-18',
      steps: 8520,
      distanceMeters: 6134,
      activityCalories: 450,
      sleepTotalMinutes: 460,
      sleepDeepMinutes: 110,
      sleepLightMinutes: 220,
      sleepRemMinutes: 105,
      sleepAwakeMinutes: 25,
      sleepScore: 86,
      sleepBedtime: 1700000000,
      sleepWakeTime: 1700027600,
      sleepAvgHr: 60,
      sleepAvgSpo2: 98,
      hrAvg: 72,
      hrResting: 60,
      hrMax: 128,
      hrMin: 52,
      hrAbnormalCount: 0,
      hrZones: {
        warmupMinutes: 30,
        fatBurnMinutes: 20,
        aerobicMinutes: 10,
        anaerobicMinutes: 0,
        extremeMinutes: 0,
      },
      hrLatest: 70,
      hrLatestTs: 1700030000,
      spo2Avg: 97,
      spo2Min: 95,
      spo2Max: 99,
      spo2Latest: 98,
      spo2LatestTs: 1700030000,
      intensityMinutes: 35,
      validStandCount: 12,
      goals: {
        stepsGoal: 10000,
        stepsAchieved: 8520,
        caloriesGoal: 500,
        caloriesAchieved: 450,
        intensityGoal: 30,
        intensityAchieved: 35,
      },
      source: 'test',
      updatedAt: 1700035000,
    }

    db.upsertDailyMetrics(sampleMetrics)

    const list = db.getDailyMetrics('2026-09-18', '2026-09-18')
    expect(list).toHaveLength(1)
    expect(list[0]?.steps).toBe(8520)
    expect(list[0]?.goals.caloriesGoal).toBe(500)
    expect(list[0]?.hrZones.warmupMinutes).toBe(30)

    const latest = db.getLatestDailyMetrics()
    expect(latest?.date).toBe('2026-09-18')
    expect(latest?.sleepScore).toBe(86)

    // Sleep segments
    const seg: SleepSegment = {
      date: '2026-09-18',
      kind: 'main',
      bedtime: 1700000000,
      wakeTime: 1700027600,
      durationMinutes: 460,
      deepMinutes: 110,
      lightMinutes: 220,
      remMinutes: 105,
      awakeMinutes: 25,
      awakeCount: 2,
      avgHr: 60,
      avgSpo2: 98,
    }
    db.upsertSleepSegment(seg)

    const segs = db.getSleepSegments('2026-09-18')
    expect(segs).toHaveLength(1)
    expect(segs[0]?.deepMinutes).toBe(110)

    // Sync runs
    db.recordSyncRun(1700000000, 1700000010, true, null, 7, 'user_123')
    const lastSync = db.getLastSyncRun()
    expect(lastSync?.ok).toBe(true)
    expect(lastSync?.targetUid).toBe('user_123')

    db.close()
  })
})
