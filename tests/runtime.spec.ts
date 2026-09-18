import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { HealthRuntime } from '../src/runtime.ts'
import { HealthDatabase } from '../src/storage/db.ts'
import { SyncRunner } from '../src/sync/runner.ts'
import type { ResolvedConfig } from '../src/types.ts'

describe('HealthRuntime', () => {
  const config: ResolvedConfig = {
    dbPath: ':memory:',
    tokenPath: 'non_existent_token.json',
    enableAutoSync: false,
    syncIntervalMinutes: 30,
    mockMode: true,
    familyMode: false,
  }

  it('provides plugin status with mock mode active', async () => {
    const ctx = new Context()
    const db = new HealthDatabase(':memory:')
    const runner = new SyncRunner(db, config)
    const runtime = new HealthRuntime(ctx, db, runner, config)

    const status = await runtime.getStatus()
    expect(status.isLoggedIn).toBe(true)
    expect(status.mockMode).toBe(true)
    expect(status.userId).toBe('demo_user_1001')

    db.close()
  })

  it('returns comprehensive health summary and calculates health score', async () => {
    const ctx = new Context()
    const db = new HealthDatabase(':memory:')
    const runner = new SyncRunner(db, config)
    const runtime = new HealthRuntime(ctx, db, runner, config)

    const summary = await runtime.getSummary()
    expect(summary.today).not.toBeNull()
    expect(summary.healthScore).toBeGreaterThanOrEqual(60)
    expect(summary.insights.length).toBeGreaterThanOrEqual(1)

    db.close()
  })

  it('generates mock data on demand and queries daily metrics', async () => {
    const ctx = new Context()
    const db = new HealthDatabase(':memory:')
    const runner = new SyncRunner(db, config)
    const runtime = new HealthRuntime(ctx, db, runner, config)

    const genRes = await runtime.generateMockData(7)
    expect(genRes.ok).toBe(true)

    const metrics = await runtime.getDailyMetrics(7)
    expect(metrics.length).toBeGreaterThan(0)

    db.close()
  })
})
