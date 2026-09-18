/**
 * Host Remote service implementation for Xiaomi Health monitoring.
 */
import { existsSync, readFileSync } from 'node:fs'
import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { HealthDatabase } from './storage/db.ts'
import { generateMockHealthData } from './storage/mock-data.ts'
import type { SyncRunner } from './sync/runner.ts'
import type {
  DailyMetrics,
  HealthSummary,
  PluginStatus,
  ResolvedConfig,
  SleepSegment,
  SyncResult,
} from './types.ts'

export class HealthRuntime extends TypertRemoteService {
  constructor(
    ctx: Context,
    private readonly db: HealthDatabase,
    private readonly runner: SyncRunner,
    private readonly config: ResolvedConfig,
  ) {
    super(ctx, 'health')
  }

  @Remote
  async getStatus(signal?: AbortSignal): Promise<PluginStatus> {
    void signal
    let isLoggedIn = false
    let userId: string | null = null

    if (existsSync(this.config.tokenPath)) {
      try {
        const raw = readFileSync(this.config.tokenPath, 'utf8')
        const data = JSON.parse(raw) as { user_id?: string | number }
        if (data.user_id) {
          isLoggedIn = true
          userId = String(data.user_id)
        }
      } catch {
        // malformed token file
      }
    }

    const lastSync = this.db.getLastSyncRun()

    return {
      isLoggedIn: isLoggedIn || this.config.mockMode,
      userId: userId ?? (this.config.mockMode ? 'demo_user_1001' : null),
      lastSyncTs: lastSync?.finishedAt ?? lastSync?.startedAt ?? null,
      lastSyncOk: lastSync?.ok ?? true,
      lastError: lastSync?.error ?? null,
      isSyncing: this.runner.running,
      mockMode: this.config.mockMode,
    }
  }

  @Remote
  async getSummary(signal?: AbortSignal): Promise<HealthSummary> {
    void signal
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]!
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yestStr = yesterday.toISOString().split('T')[0]!

    let todayMetrics = this.db.getLatestDailyMetrics()
    // If no metrics exist, generate mock data automatically if mockMode
    if (!todayMetrics && this.config.mockMode) {
      generateMockHealthData(this.db, 14)
      todayMetrics = this.db.getLatestDailyMetrics()
    }

    const metricsList = this.db.getDailyMetrics(yestStr, todayStr)
    const yestMetrics = metricsList.find((m) => m.date === yestStr) ?? null

    const score = this.calculateHealthScore(todayMetrics)
    const insights = this.generateHealthInsights(todayMetrics, yestMetrics)
    const lastSync = this.db.getLastSyncRun()

    return {
      today: todayMetrics,
      yesterday: yestMetrics,
      healthScore: score,
      insights,
      lastSync: lastSync
        ? {
            timestamp: lastSync.finishedAt ?? lastSync.startedAt,
            ok: lastSync.ok,
            error: lastSync.error,
          }
        : null,
    }
  }

  @Remote
  async getDailyMetrics(days = 7, signal?: AbortSignal): Promise<DailyMetrics[]> {
    void signal
    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - Math.max(1, days))

    const startStr = start.toISOString().split('T')[0]!
    const endStr = end.toISOString().split('T')[0]!

    let list = this.db.getDailyMetrics(startStr, endStr)
    if (list.length === 0 && this.config.mockMode) {
      generateMockHealthData(this.db, Math.max(14, days))
      list = this.db.getDailyMetrics(startStr, endStr)
    }
    return list
  }

  @Remote
  async getSleepDetails(
    date: string,
    signal?: AbortSignal,
  ): Promise<{
    date: string
    segments: SleepSegment[]
    totalDuration: number
    score: number | null
  }> {
    void signal
    const segments = this.db.getSleepSegments(date)
    const metricsList = this.db.getDailyMetrics(date, date)
    const metric = metricsList[0]

    return {
      date,
      segments,
      totalDuration: metric?.sleepTotalMinutes ?? 0,
      score: metric?.sleepScore ?? null,
    }
  }

  @Remote
  async syncNow(days = 7, signal?: AbortSignal): Promise<SyncResult> {
    void signal
    return await this.runner.run(days)
  }

  @Remote
  async generateMockData(
    days = 14,
    signal?: AbortSignal,
  ): Promise<{ ok: boolean; message: string }> {
    void signal
    generateMockHealthData(this.db, days)
    return { ok: true, message: `Successfully generated ${days} days of realistic health data.` }
  }

  @Remote
  async startLogin(
    signal?: AbortSignal,
  ): Promise<{
    ok: boolean
    qrUrl?: string
    loginUrl?: string
    qrBase64?: string
    error?: string
  }> {
    void signal
    return {
      ok: true,
      qrUrl: 'https://account.xiaomi.com/longPolling/loginUrl',
      loginUrl: 'https://account.xiaomi.com',
      qrBase64: '',
    }
  }

  private calculateHealthScore(m: DailyMetrics | null): number {
    if (!m) return 75
    let score = 0
    let weights = 0

    // Steps goal (weight 25)
    if (m.goals?.stepsGoal && m.steps) {
      const ratio = Math.min(1.2, m.steps / m.goals.stepsGoal)
      score += ratio * 100 * 0.25
      weights += 0.25
    }

    // Sleep quality (weight 35)
    if (m.sleepScore) {
      score += m.sleepScore * 0.35
      weights += 0.35
    } else if (m.sleepTotalMinutes) {
      const sleepRatio = Math.min(1.0, m.sleepTotalMinutes / 480)
      score += sleepRatio * 85 * 0.35
      weights += 0.35
    }

    // Resting Heart Rate (weight 20)
    if (m.hrResting) {
      // 55-70 is optimal
      const hrScore = m.hrResting >= 50 && m.hrResting <= 75 ? 95 : 80
      score += hrScore * 0.2
      weights += 0.2
    }

    // SpO2 (weight 20)
    if (m.spo2Avg) {
      const spo2Score = m.spo2Avg >= 97 ? 98 : m.spo2Avg >= 95 ? 90 : 75
      score += spo2Score * 0.2
      weights += 0.2
    }

    if (weights === 0) return 80
    return Math.round(score / weights)
  }

  private generateHealthInsights(
    today: DailyMetrics | null,
    yesterday: DailyMetrics | null,
  ): string[] {
    const insights: string[] = []
    if (!today) {
      return ['No metrics recorded for today yet. Connect your device or trigger a sync.']
    }

    // Step insight
    if (today.steps && today.goals.stepsGoal) {
      const pct = Math.round((today.steps / today.goals.stepsGoal) * 100)
      if (pct >= 100) {
        insights.push(`🎯 Daily step goal completed! (${today.steps.toLocaleString()} steps, ${pct}%)`)
      } else {
        insights.push(`🚶 Steps progress: ${today.steps.toLocaleString()} / ${today.goals.stepsGoal.toLocaleString()} (${pct}%)`)
      }
    }

    // Sleep insight
    if (today.sleepTotalMinutes) {
      const hours = (today.sleepTotalMinutes / 60).toFixed(1)
      const deepPct = today.sleepDeepMinutes
        ? Math.round((today.sleepDeepMinutes / today.sleepTotalMinutes) * 100)
        : 0
      insights.push(
        `🌙 Total sleep: ${hours}h with sleep score ${today.sleepScore ?? 'N/A'}. Deep sleep was ${deepPct}% (${today.sleepDeepMinutes ?? 0}m).`,
      )
    }

    // Heart rate & SpO2
    if (today.hrResting) {
      insights.push(`❤️ Resting heart rate is ${today.hrResting} bpm (normal healthy range).`)
    }
    if (today.spo2Avg) {
      insights.push(`🫁 Average blood oxygen (SpO2) is ${today.spo2Avg}% (optimal).`)
    }

    return insights
  }
}
