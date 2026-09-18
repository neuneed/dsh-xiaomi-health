/**
 * Host Typert model manifest for the health Remote.
 */
import type { TypertContribution } from '@deepseek-ai/dsh-typert-registry/types'
import { DSH_HEALTH_INVOCATIONS } from './contract.ts'

export const TYPERT_MANIFEST: TypertContribution = {
  package: 'dsh-xiaomi-health',
  face: 'host',
  schemas: [],
  model: {
    services: [
      {
        key: 'health',
        exportName: 'HealthRuntime',
        description: 'Xiaomi Health (Mi Fitness) metrics and monitoring service.',
        tags: [],
        members: [
          {
            kind: 'method',
            name: 'getStatus',
            signature: 'getStatus(signal?: AbortSignal): Promise<PluginStatus>',
          },
          {
            kind: 'method',
            name: 'getSummary',
            signature: 'getSummary(signal?: AbortSignal): Promise<HealthSummary>',
          },
          {
            kind: 'method',
            name: 'getDailyMetrics',
            signature: 'getDailyMetrics(days?: number, signal?: AbortSignal): Promise<DailyMetrics[]>',
          },
          {
            kind: 'method',
            name: 'getSleepDetails',
            signature: 'getSleepDetails(date: string, signal?: AbortSignal): Promise<SleepDetails>',
          },
          {
            kind: 'method',
            name: 'syncNow',
            signature: 'syncNow(days?: number, signal?: AbortSignal): Promise<SyncResult>',
          },
          {
            kind: 'method',
            name: 'generateMockData',
            signature: 'generateMockData(days?: number, signal?: AbortSignal): Promise<MockGenResult>',
          },
          {
            kind: 'method',
            name: 'startLogin',
            signature: 'startLogin(signal?: AbortSignal): Promise<LoginInitResult>',
          },
        ],
        types: [],
      },
    ],
    events: [],
    objects: [],
  },
  invocations: DSH_HEALTH_INVOCATIONS,
}
