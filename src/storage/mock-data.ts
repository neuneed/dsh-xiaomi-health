/**
 * Realistic Mock Health Data Generator for DSH Xiaomi Health demo.
 *
 * Populates realistic multi-day metrics (steps, sleep stages, heart rate curves,
 * SpO2, and activity goals) so the UI and AI tools can be fully exercised offline.
 */
import type { HealthDatabase } from './db.ts'
import type { DailyMetrics, SleepSegment } from '../types.ts'

export function generateMockHealthData(db: HealthDatabase, days = 14): void {
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]!

    // Deterministic pseudo-random based on day index
    const seed = (i * 9301 + 49297) % 233280
    const rnd = seed / 233280

    const steps = Math.floor(7500 + rnd * 6000)
    const distanceMeters = Math.floor(steps * 0.72)
    const activityCalories = Math.floor(380 + rnd * 320)
    const intensityMinutes = Math.floor(25 + rnd * 35)
    const validStandCount = Math.floor(10 + rnd * 4)

    // Sleep calculation (total ~420-500 mins)
    const sleepTotalMinutes = Math.floor(410 + rnd * 90)
    const sleepDeepMinutes = Math.floor(sleepTotalMinutes * (0.2 + rnd * 0.08))
    const sleepRemMinutes = Math.floor(sleepTotalMinutes * (0.22 + rnd * 0.06))
    const sleepAwakeMinutes = Math.floor(15 + rnd * 20)
    const sleepLightMinutes =
      sleepTotalMinutes - sleepDeepMinutes - sleepRemMinutes - sleepAwakeMinutes
    const sleepScore = Math.floor(78 + rnd * 17)

    // Bedtime at ~23:15, wake at ~07:00
    const bedDate = new Date(d)
    bedDate.setHours(23, Math.floor(10 + rnd * 30), 0, 0)
    const bedtimeTs = Math.floor(bedDate.getTime() / 1000) - 86400 // yesterday night
    const wakeTs = bedtimeTs + sleepTotalMinutes * 60

    // Heart rate
    const hrResting = Math.floor(58 + rnd * 8)
    const hrAvg = Math.floor(hrResting + 10 + rnd * 6)
    const hrMax = Math.floor(120 + rnd * 25)
    const hrMin = Math.floor(48 + rnd * 6)
    const hrLatest = Math.floor(68 + rnd * 12)

    // SpO2
    const spo2Avg = Math.floor(96 + rnd * 3)
    const spo2Min = Math.floor(93 + rnd * 2)
    const spo2Max = 99
    const spo2Latest = Math.floor(97 + rnd * 2)

    const metrics: DailyMetrics = {
      date: dateStr,
      steps,
      distanceMeters,
      activityCalories,
      sleepTotalMinutes,
      sleepDeepMinutes,
      sleepLightMinutes,
      sleepRemMinutes,
      sleepAwakeMinutes,
      sleepScore,
      sleepBedtime: bedtimeTs,
      sleepWakeTime: wakeTs,
      sleepAvgHr: hrResting + 2,
      sleepAvgSpo2: 97,
      hrAvg,
      hrResting,
      hrMax,
      hrMin,
      hrAbnormalCount: 0,
      hrZones: {
        warmupMinutes: Math.floor(20 + rnd * 25),
        fatBurnMinutes: Math.floor(15 + rnd * 20),
        aerobicMinutes: Math.floor(8 + rnd * 12),
        anaerobicMinutes: Math.floor(rnd * 5),
        extremeMinutes: 0,
      },
      hrLatest,
      hrLatestTs: Math.floor(Date.now() / 1000),
      spo2Avg,
      spo2Min,
      spo2Max,
      spo2Latest,
      spo2LatestTs: Math.floor(Date.now() / 1000),
      intensityMinutes,
      validStandCount,
      goals: {
        stepsGoal: 10000,
        stepsAchieved: steps,
        caloriesGoal: 500,
        caloriesAchieved: activityCalories,
        intensityGoal: 30,
        intensityAchieved: intensityMinutes,
      },
      source: 'mock_xiaomi',
      updatedAt: Math.floor(Date.now() / 1000),
    }

    db.upsertDailyMetrics(metrics)

    // Main sleep segment
    const mainSeg: SleepSegment = {
      date: dateStr,
      kind: 'main',
      bedtime: bedtimeTs,
      wakeTime: wakeTs,
      durationMinutes: sleepTotalMinutes,
      deepMinutes: sleepDeepMinutes,
      lightMinutes: sleepLightMinutes,
      remMinutes: sleepRemMinutes,
      awakeMinutes: sleepAwakeMinutes,
      awakeCount: Math.floor(1 + rnd * 3),
      avgHr: hrResting + 2,
      avgSpo2: 97,
    }
    db.upsertSleepSegment(mainSeg)

    // Optional afternoon nap on weekends
    if (i % 5 === 0) {
      const napBed = new Date(d)
      napBed.setHours(13, 30, 0, 0)
      const napBedTs = Math.floor(napBed.getTime() / 1000)
      const napDur = 45
      const napSeg: SleepSegment = {
        date: dateStr,
        kind: 'nap',
        bedtime: napBedTs,
        wakeTime: napBedTs + napDur * 60,
        durationMinutes: napDur,
        deepMinutes: 10,
        lightMinutes: 35,
        remMinutes: 0,
        awakeMinutes: 0,
        awakeCount: 0,
        avgHr: hrResting + 4,
        avgSpo2: 98,
      }
      db.upsertSleepSegment(napSeg)
    }
  }

  // Record a successful sync run
  db.recordSyncRun(
    Math.floor(Date.now() / 1000) - 300,
    Math.floor(Date.now() / 1000),
    true,
    null,
    days,
    'demo_user_1001',
  )
}
