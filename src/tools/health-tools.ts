/**
 * DeepSeek Harness Agent Tools for Xiaomi Health.
 *
 * Allows LLM agents to inspect user health metrics, analyze sleep architectures,
 * check cardiovascular indicators, and trigger on-demand synchronization.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { HealthDatabase } from '../storage/db.ts'
import type { SyncRunner } from '../sync/runner.ts'
import type { ResolvedConfig } from '../types.ts'

export function registerHealthTools(
  ctx: Context,
  db: HealthDatabase,
  runner: SyncRunner,
  config: ResolvedConfig,
): () => void {
  // Check if tools service is available on ctx
  const toolsService = (ctx as unknown as { tools?: { register: (tool: any) => () => void } }).tools
  if (!toolsService || typeof toolsService.register !== 'function') {
    return () => {}
  }

  const disposers: (() => void)[] = []

  // 1. health_get_summary
  disposers.push(
    toolsService.register({
      name: 'health_get_summary',
      description:
        "Retrieve today's health summary including daily step count, active calories, sleep duration & score, resting heart rate, and blood oxygen (SpO2).",
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Optional date in YYYY-MM-DD format. Defaults to today.',
          },
        },
      },
      output: {
        schema: { type: 'object' },
        render: (_args: unknown, value: unknown) => [
          { type: 'text', text: JSON.stringify(value, null, 2) },
        ],
      },
      async execute(args: { date?: string }) {
        const targetDate = args.date || new Date().toISOString().split('T')[0]!
        const list = db.getDailyMetrics(targetDate, targetDate)
        const metric = list[0] || db.getLatestDailyMetrics()

        if (!metric) {
          return {
            status: 'no_data',
            message: 'No health metrics found. You may trigger a sync using health_sync_now.',
          }
        }

        return {
          status: 'success',
          date: metric.date,
          steps: {
            current: metric.steps,
            goal: metric.goals.stepsGoal,
            achievedPercent: metric.goals.stepsGoal
              ? Math.round(((metric.steps || 0) / metric.goals.stepsGoal) * 100)
              : null,
          },
          calories: {
            burnedKcal: metric.activityCalories,
            goalKcal: metric.goals.caloriesGoal,
          },
          sleep: {
            totalHours: metric.sleepTotalMinutes ? (metric.sleepTotalMinutes / 60).toFixed(1) : null,
            score: metric.sleepScore,
            deepMinutes: metric.sleepDeepMinutes,
            remMinutes: metric.sleepRemMinutes,
          },
          heartRate: {
            latestBpm: metric.hrLatest,
            restingBpm: metric.hrResting,
            range: metric.hrMin && metric.hrMax ? `${metric.hrMin}-${metric.hrMax} bpm` : null,
          },
          bloodOxygen: {
            avgPercent: metric.spo2Avg,
            latestPercent: metric.spo2Latest,
          },
          intensityMinutes: metric.intensityMinutes,
          standingHours: metric.validStandCount,
        }
      },
    }),
  )

  // 2. health_query_metrics
  disposers.push(
    toolsService.register({
      name: 'health_query_metrics',
      description:
        'Query historical daily health metrics (steps, heart rate, sleep, calories, etc.) over the past N days to analyze trends.',
      parameters: {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Number of past days to query (default: 7, max: 30)',
          },
        },
      },
      output: {
        schema: { type: 'object' },
        render: (_args: unknown, value: unknown) => [
          { type: 'text', text: JSON.stringify(value, null, 2) },
        ],
      },
      async execute(args: { days?: number }) {
        const days = Math.min(30, Math.max(1, args.days || 7))
        const end = new Date()
        const start = new Date(end)
        start.setDate(start.getDate() - days)

        const list = db.getDailyMetrics(
          start.toISOString().split('T')[0]!,
          end.toISOString().split('T')[0]!,
        )

        return {
          requestedDays: days,
          recordedDays: list.length,
          metrics: list.map((m) => ({
            date: m.date,
            steps: m.steps,
            activityCalories: m.activityCalories,
            sleepTotalMinutes: m.sleepTotalMinutes,
            sleepScore: m.sleepScore,
            hrResting: m.hrResting,
            hrAvg: m.hrAvg,
            spo2Avg: m.spo2Avg,
          })),
        }
      },
    }),
  )

  // 3. health_query_sleep
  disposers.push(
    toolsService.register({
      name: 'health_query_sleep',
      description:
        'Get in-depth sleep stage breakdown (deep sleep, light sleep, REM, awake time, bedtime, wake time, nap segments) for a specific date.',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Date in YYYY-MM-DD format (defaults to yesterday / last night).',
          },
        },
      },
      output: {
        schema: { type: 'object' },
        render: (_args: unknown, value: unknown) => [
          { type: 'text', text: JSON.stringify(value, null, 2) },
        ],
      },
      async execute(args: { date?: string }) {
        let date = args.date
        if (!date) {
          const d = new Date()
          d.setDate(d.getDate() - 1)
          date = d.toISOString().split('T')[0]!
        }

        const metrics = db.getDailyMetrics(date, date)[0]
        const segments = db.getSleepSegments(date)

        if (!metrics && segments.length === 0) {
          return { status: 'no_data', date, message: `No sleep records found for ${date}.` }
        }

        return {
          status: 'success',
          date,
          totalDurationMinutes: metrics?.sleepTotalMinutes ?? 0,
          sleepScore: metrics?.sleepScore ?? null,
          stages: {
            deepMinutes: metrics?.sleepDeepMinutes ?? 0,
            lightMinutes: metrics?.sleepLightMinutes ?? 0,
            remMinutes: metrics?.sleepRemMinutes ?? 0,
            awakeMinutes: metrics?.sleepAwakeMinutes ?? 0,
          },
          avgHeartRate: metrics?.sleepAvgHr ?? null,
          avgSpo2: metrics?.sleepAvgSpo2 ?? null,
          segments: segments.map((s) => ({
            kind: s.kind,
            durationMinutes: s.durationMinutes,
            deepMinutes: s.deepMinutes,
            lightMinutes: s.lightMinutes,
            remMinutes: s.remMinutes,
            awakeCount: s.awakeCount,
          })),
        }
      },
    }),
  )

  // 4. health_sync_now
  disposers.push(
    toolsService.register({
      name: 'health_sync_now',
      description: 'Trigger on-demand data synchronization with Xiaomi Health Cloud.',
      parameters: {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Number of past days to sync (default: 7)',
          },
        },
      },
      output: {
        schema: { type: 'object' },
        render: (_args: unknown, value: unknown) => [
          { type: 'text', text: JSON.stringify(value, null, 2) },
        ],
      },
      async execute(args: { days?: number }) {
        const days = args.days || 7
        const res = await runner.run(days)
        return {
          success: res.ok,
          daysSynced: res.writtenDays,
          error: res.error ?? null,
        }
      },
    }),
  )

  // 5. health_get_insights
  disposers.push(
    toolsService.register({
      name: 'health_get_insights',
      description:
        'Analyze user health patterns across recent days and generate clinical/lifestyle observations and health score.',
      parameters: {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Number of days to analyze (default: 7)',
          },
        },
      },
      output: {
        schema: { type: 'object' },
        render: (_args: unknown, value: unknown) => [
          { type: 'text', text: JSON.stringify(value, null, 2) },
        ],
      },
      async execute(args: { days?: number }) {
        const days = Math.min(30, Math.max(3, args.days || 7))
        const end = new Date()
        const start = new Date(end)
        start.setDate(start.getDate() - days)

        const list = db.getDailyMetrics(
          start.toISOString().split('T')[0]!,
          end.toISOString().split('T')[0]!,
        )

        if (list.length === 0) {
          return {
            status: 'insufficient_data',
            message: 'Need at least 1 day of health records to generate insights.',
          }
        }

        const avgSteps = Math.round(
          list.reduce((acc, cur) => acc + (cur.steps || 0), 0) / list.length,
        )
        const avgSleep = Math.round(
          list.reduce((acc, cur) => acc + (cur.sleepTotalMinutes || 0), 0) / list.length,
        )
        const avgRestingHr = Math.round(
          list.reduce((acc, cur) => acc + (cur.hrResting || 0), 0) /
            list.filter((x) => x.hrResting).length || 65,
        )

        const observations: string[] = []
        if (avgSteps >= 8000) {
          observations.push(`Great activity level: Average daily steps is ${avgSteps}.`)
        } else {
          observations.push(`Sedentary tendency: Average daily steps is ${avgSteps} (target: 8000+).`)
        }

        if (avgSleep >= 420) {
          observations.push(`Optimal sleep duration: Averaging ${(avgSleep / 60).toFixed(1)} hours per night.`)
        } else {
          observations.push(`Sleep debt detected: Averaging only ${(avgSleep / 60).toFixed(1)} hours per night.`)
        }

        if (avgRestingHr >= 55 && avgRestingHr <= 75) {
          observations.push(`Healthy resting heart rate: Averaging ${avgRestingHr} bpm.`)
        }

        return {
          status: 'success',
          evaluatedDays: list.length,
          averages: {
            dailySteps: avgSteps,
            sleepHours: Number((avgSleep / 60).toFixed(1)),
            restingHeartRate: avgRestingHr,
          },
          observations,
        }
      },
    }),
  )

  return () => {
    for (const dispose of disposers) {
      if (typeof dispose === 'function') {
        dispose()
      }
    }
  }
}
