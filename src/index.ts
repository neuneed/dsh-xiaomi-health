/**
 * dsh-xiaomi-health — Host plugin entry for DeepSeek Harness.
 *
 * Sets up the SQLite database, sync bridge, Typert Remote service,
 * auto-sync scheduler, and model-facing health tools.
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-typert-registry'
import { HealthRuntime } from './runtime.ts'
import { TYPERT_MANIFEST } from './typert.ts'
import { HealthDatabase } from './storage/db.ts'
import { SyncRunner } from './sync/runner.ts'
import { SyncScheduler } from './sync/scheduler.ts'
import { registerHealthTools } from './tools/health-tools.ts'
import type { ResolvedConfig } from './types.ts'

export const name = 'dsh-xiaomi-health'
export const inject = ['typert']

export interface Config {
  dbPath: string
  tokenPath: string
  enableAutoSync: boolean
  syncIntervalMinutes: number
  mockMode: boolean
  familyMode: boolean
  targetUid?: string
  pythonPath?: string
}

export const Config = z.object({
  dbPath: z.string().default('data/health.sqlite'),
  tokenPath: z.string().default('data/token.json'),
  enableAutoSync: z.boolean().default(false),
  syncIntervalMinutes: z.number().default(30),
  mockMode: z.boolean().default(true),
  familyMode: z.boolean().default(false),
  targetUid: z.string(),
  pythonPath: z.string(),
})

export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {}) as ResolvedConfig

  const db = new HealthDatabase(resolved.dbPath)
  const runner = new SyncRunner(db, resolved)
  const scheduler = new SyncScheduler(runner, resolved)

  new HealthRuntime(ctx, db, runner, resolved)

  // Start background auto-sync if configured
  ctx.effect(() => scheduler.start(), 'dsh-xiaomi-health: scheduler')

  // Register Typert RPC manifest for Remote
  ctx.effect(() => {
    const dispose = ctx.typert.register(TYPERT_MANIFEST)
    return () => {
      void dispose()
    }
  }, 'dsh-xiaomi-health: typert manifest')

  // Register DSH model tools
  ctx.effect(() => registerHealthTools(ctx, db, runner, resolved), 'dsh-xiaomi-health: agent tools')

  // Dispose database connection on plugin cleanup
  ctx.effect(() => {
    return () => {
      db.close()
    }
  }, 'dsh-xiaomi-health: db cleanup')
}
