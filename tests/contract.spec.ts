import { describe, expect, it } from 'vitest'
import {
  DSH_HEALTH_INVOCATIONS,
  pluginStatusSchema,
  dailyMetricsSchema,
  sleepSegmentSchema,
  healthSummarySchema,
  syncResultSchema,
} from '../src/contract.ts'
import { DSH_HEALTH_REMOTE } from '../src/client/remote.ts'
import { TYPERT_MANIFEST } from '../src/typert.ts'

describe('dsh-xiaomi-health wire contract', () => {
  it('shares identical invocation descriptors between host and client', () => {
    expect(DSH_HEALTH_INVOCATIONS).toHaveLength(7)
    expect(TYPERT_MANIFEST.invocations).toBe(DSH_HEALTH_INVOCATIONS)
    expect(DSH_HEALTH_REMOTE.descriptors).toBe(DSH_HEALTH_INVOCATIONS)
  })

  it('validates plugin status schema', () => {
    const valid = {
      isLoggedIn: true,
      userId: '12345678',
      lastSyncTs: 1700000000,
      lastSyncOk: true,
      lastError: null,
      isSyncing: false,
      mockMode: true,
    }
    expect(pluginStatusSchema.parse(valid)).toEqual(valid)
  })

  it('validates sleep segment schema', () => {
    const seg = {
      date: '2026-09-18',
      kind: 'main' as const,
      bedtime: 1700000000,
      wakeTime: 1700028800,
      durationMinutes: 480,
      deepMinutes: 120,
      lightMinutes: 240,
      remMinutes: 100,
      awakeMinutes: 20,
      awakeCount: 2,
      avgHr: 62,
      avgSpo2: 97,
    }
    expect(sleepSegmentSchema.parse(seg).durationMinutes).toBe(480)
  })

  it('validates sync result schema', () => {
    const res = { ok: true, days: 7, writtenDays: 7 }
    expect(syncResultSchema.parse(res)).toEqual(res)
  })
})
