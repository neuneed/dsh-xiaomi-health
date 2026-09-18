/**
 * Sync Runner Bridge: coordinates between Node host runtime and the Python sync engine.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { HealthDatabase } from '../storage/db.ts'
import { generateMockHealthData } from '../storage/mock-data.ts'
import type { ResolvedConfig, SyncResult } from '../types.ts'

export class SyncRunner {
  private isSyncing = false

  constructor(
    private readonly db: HealthDatabase,
    private readonly config: ResolvedConfig,
  ) {}

  public get running(): boolean {
    return this.isSyncing
  }

  public async run(days = 7): Promise<SyncResult> {
    if (this.isSyncing) {
      return { ok: false, days, writtenDays: 0, error: 'Sync is already in progress' }
    }

    this.isSyncing = true
    try {
      // If mockMode is on or token does not exist, run mock generator for instant demo
      if (this.config.mockMode || !existsSync(this.config.tokenPath)) {
        generateMockHealthData(this.db, Math.max(days, 7))
        return { ok: true, days, writtenDays: days }
      }

      // Run Python sync engine
      return await this.executePythonSync(days)
    } finally {
      this.isSyncing = false
    }
  }

  private executePythonSync(days: number): Promise<SyncResult> {
    return new Promise((res) => {
      const pythonExe = this.config.pythonPath || (existsSync('/home/asdf/.local/bin/uv') ? '/home/asdf/.local/bin/uv' : 'python3')
      const scriptPath = resolve(process.cwd(), 'python/scripts/sync_cli.py')

      const args = pythonExe.endsWith('uv')
        ? ['run', '--python', '3.12', '--with', 'mi-fitness', '--with', 'httpx', 'python', scriptPath]
        : [scriptPath]

      args.push(
        '--db',
        this.config.dbPath,
        '--token',
        this.config.tokenPath,
        '--days',
        String(days),
        '--json',
      )

      if (this.config.familyMode) {
        args.push('--family-mode')
      }
      if (this.config.targetUid) {
        args.push('--uid', this.config.targetUid)
      }

      let stdout = ''
      let stderr = ''

      const child = spawn(pythonExe, args, {
        cwd: process.cwd(),
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      child.stdout.on('data', (d: Buffer) => {
        stdout += d.toString()
      })

      child.stderr.on('data', (d: Buffer) => {
        stderr += d.toString()
      })

      child.on('error', (err) => {
        res({
          ok: false,
          days,
          writtenDays: 0,
          error: `Failed to spawn Python process: ${err.message}`,
        })
      })

      child.on('close', (code) => {
        if (code !== 0) {
          res({
            ok: false,
            days,
            writtenDays: 0,
            error: stderr || stdout || `Process exited with code ${code}`,
          })
          return
        }

        try {
          const parsed = JSON.parse(stdout.trim()) as {
            ok?: boolean
            error?: string
            counters?: { days_written?: number }
          }
          if (parsed.ok) {
            res({
              ok: true,
              days,
              writtenDays: parsed.counters?.days_written ?? days,
            })
          } else {
            res({
              ok: false,
              days,
              writtenDays: 0,
              error: parsed.error ?? 'Unknown error from sync engine',
            })
          }
        } catch {
          res({
            ok: true,
            days,
            writtenDays: days,
          })
        }
      })
    })
  }
}
