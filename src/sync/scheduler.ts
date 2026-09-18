/**
 * Background auto-sync scheduler for health metrics.
 */
import type { SyncRunner } from './runner.ts'
import type { ResolvedConfig } from '../types.ts'

export class SyncScheduler {
  private timer: NodeJS.Timeout | null = null

  constructor(
    private readonly runner: SyncRunner,
    private readonly config: ResolvedConfig,
  ) {}

  public start(): () => void {
    if (!this.config.enableAutoSync) {
      return () => {}
    }

    const intervalMs = Math.max(5, this.config.syncIntervalMinutes) * 60 * 1000

    this.timer = setInterval(() => {
      void this.runner.run(3).catch(() => {})
    }, intervalMs)

    return () => {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
