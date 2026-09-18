import { describe, expect, it } from 'vitest'
import { HealthDatabase } from '../src/storage/db.ts'
import { generateMockHealthData } from '../src/storage/mock-data.ts'

describe('generateMockHealthData', () => {
  it('generates realistic multi-day health data and populates SQLite', () => {
    const db = new HealthDatabase(':memory:')

    generateMockHealthData(db, 7)

    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - 10)

    const list = db.getDailyMetrics(
      start.toISOString().split('T')[0]!,
      end.toISOString().split('T')[0]!,
    )

    expect(list.length).toBeGreaterThanOrEqual(6)

    for (const m of list) {
      expect(m.steps).toBeGreaterThan(5000)
      expect(m.sleepTotalMinutes).toBeGreaterThan(300)
      expect(m.hrResting).toBeGreaterThanOrEqual(50)
      expect(m.spo2Avg).toBeGreaterThanOrEqual(95)
      expect(m.goals.stepsGoal).toBe(10000)
    }

    const lastSync = db.getLastSyncRun()
    expect(lastSync?.ok).toBe(true)
    expect(lastSync?.targetUid).toBe('demo_user_1001')

    db.close()
  })
})
