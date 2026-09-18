/**
 * Client Remote contribution and typed namespace face for health.
 */
import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import type {
  DailyMetrics,
  HealthSummary,
  PluginStatus,
  SleepSegment,
  SyncResult,
} from '../types.ts'
import { DSH_HEALTH_INVOCATIONS } from '../contract.ts'

export const DSH_HEALTH_REMOTE: TypertRemoteContribution = {
  package: 'dsh-xiaomi-health',
  descriptors: DSH_HEALTH_INVOCATIONS,
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$6865616c7468 {
    getStatus: (signal?: AbortSignal) => Promise<RemoteResult<PluginStatus>>
    getSummary: (signal?: AbortSignal) => Promise<RemoteResult<HealthSummary>>
    getDailyMetrics: (days?: number, signal?: AbortSignal) => Promise<RemoteResult<DailyMetrics[]>>
    getSleepDetails: (
      date: string,
      signal?: AbortSignal,
    ) => Promise<
      RemoteResult<{
        date: string
        segments: SleepSegment[]
        totalDuration: number
        score: number | null
      }>
    >
    syncNow: (days?: number, signal?: AbortSignal) => Promise<RemoteResult<SyncResult>>
    generateMockData: (
      days?: number,
      signal?: AbortSignal,
    ) => Promise<RemoteResult<{ ok: boolean; message: string }>>
    startLogin: (
      signal?: AbortSignal,
    ) => Promise<
      RemoteResult<{
        ok: boolean
        qrUrl?: string
        loginUrl?: string
        qrBase64?: string
        error?: string
      }>
    >
  }

  interface TypertRemoteMap {
    'health/getStatus': TypertRemoteNamespace$6865616c7468['getStatus']
    'health/getSummary': TypertRemoteNamespace$6865616c7468['getSummary']
    'health/getDailyMetrics': TypertRemoteNamespace$6865616c7468['getDailyMetrics']
    'health/getSleepDetails': TypertRemoteNamespace$6865616c7468['getSleepDetails']
    'health/syncNow': TypertRemoteNamespace$6865616c7468['syncNow']
    'health/generateMockData': TypertRemoteNamespace$6865616c7468['generateMockData']
    'health/startLogin': TypertRemoteNamespace$6865616c7468['startLogin']
  }

  interface TypertRemoteNamespaceMap {
    health: TypertRemoteNamespace$6865616c7468
  }
}
