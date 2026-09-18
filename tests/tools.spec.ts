import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { HealthDatabase } from '../src/storage/db.ts'
import { SyncRunner } from '../src/sync/runner.ts'
import { registerHealthTools } from '../src/tools/health-tools.ts'
import { generateMockHealthData } from '../src/storage/mock-data.ts'
import type { ResolvedConfig } from '../src/types.ts'

describe('Xiaomi Health Agent Tools', () => {
  const config: ResolvedConfig = {
    dbPath: ':memory:',
    tokenPath: 'data/token.json',
    enableAutoSync: false,
    syncIntervalMinutes: 30,
    mockMode: true,
    familyMode: false,
  }

  it('registers tools on ctx.tools and executes health queries', async () => {
    const registeredTools: Record<string, any> = {}

    const ctx = new Context()
    // Mock the tools service
    ;(ctx as any).tools = {
      register: (tool: any) => {
        registeredTools[tool.name] = tool
        return () => {
          delete registeredTools[tool.name]
        }
      },
    }

    const db = new HealthDatabase(':memory:')
    generateMockHealthData(db, 7)
    const runner = new SyncRunner(db, config)

    const dispose = registerHealthTools(ctx, db, runner, config)

    expect(registeredTools['health_get_summary']).toBeDefined()
    expect(registeredTools['health_query_metrics']).toBeDefined()
    expect(registeredTools['health_query_sleep']).toBeDefined()
    expect(registeredTools['health_sync_now']).toBeDefined()
    expect(registeredTools['health_get_insights']).toBeDefined()

    // Test health_get_summary
    const summary = await registeredTools['health_get_summary'].execute({})
    expect(summary.status).toBe('success')
    expect(summary.steps.current).toBeGreaterThan(0)
    expect(summary.sleep.score).toBeGreaterThan(0)

    // Test health_query_metrics
    const metricsRes = await registeredTools['health_query_metrics'].execute({ days: 7 })
    expect(metricsRes.metrics.length).toBeGreaterThan(0)

    // Test health_query_sleep
    const sleepRes = await registeredTools['health_query_sleep'].execute({})
    expect(sleepRes.status).toBe('success')
    expect(sleepRes.stages.deepMinutes).toBeGreaterThan(0)

    // Test health_get_insights
    const insightsRes = await registeredTools['health_get_insights'].execute({ days: 7 })
    expect(insightsRes.status).toBe('success')
    expect(insightsRes.observations.length).toBeGreaterThan(0)

    // Test cleanup
    dispose()
    expect(Object.keys(registeredTools).length).toBe(0)

    db.close()
  })
})
