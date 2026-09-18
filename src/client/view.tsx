/**
 * Main Xiaomi Health Dashboard View component for DeepSeek Harness.
 */
import React, { useEffect, useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  DailyMetrics,
  HealthSummary,
  PluginStatus,
  SyncResult,
} from '../types.ts'
import type { Translate } from './locales.ts'
import { SyncStatusBar } from './components/SyncStatusBar.tsx'
import { ActivityRings } from './components/ActivityRings.tsx'
import { SleepCard } from './components/SleepCard.tsx'
import { HeartRateCard } from './components/HeartRateCard.tsx'
import { MetricGrid } from './components/MetricGrid.tsx'
import { LoginModal } from './components/LoginModal.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'conversation.view': {
      kind: 'list'
      scope: 'session'
      owner: { inspect?: { callId: string } | null; onInspectDone?: () => void }
    }
  }
}

type RemoteResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: { message: string } }

export interface HealthActions {
  getStatus: () => Promise<RemoteResult<PluginStatus>>
  getSummary: () => Promise<RemoteResult<HealthSummary>>
  getDailyMetrics: (days: number) => Promise<RemoteResult<DailyMetrics[]>>
  syncNow: (days: number) => Promise<RemoteResult<SyncResult>>
  generateMockData: (days: number) => Promise<RemoteResult<{ ok: boolean; message: string }>>
  startLogin: () => Promise<
    RemoteResult<{
      ok: boolean
      qrUrl?: string
      loginUrl?: string
      qrBase64?: string
      error?: string
    }>
  >
}

export type HealthViewSlotProps = PropsRuntime<'conversation.view'> & {
  actions: HealthActions
  t: Translate
}

export interface HealthViewProps {
  actions: HealthActions
  t: Translate
}

export const HealthView: React.FC<HealthViewProps> = ({ actions, t }) => {
  const [status, setStatus] = useState<PluginStatus | null>(null)
  const [summary, setSummary] = useState<HealthSummary | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginData, setLoginData] = useState<{
    qrBase64?: string
    qrUrl?: string
    loginUrl?: string
  }>({})

  const refresh = async () => {
    try {
      const [statusRes, summaryRes] = await Promise.all([
        actions.getStatus(),
        actions.getSummary(),
      ])
      if (statusRes.ok) setStatus(statusRes.value)
      if (summaryRes.ok) setSummary(summaryRes.value)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    setError(null)
    try {
      const res = await actions.syncNow(7)
      if (res.ok) {
        await refresh()
      } else {
        setError(res.error.message)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSyncing(false)
    }
  }

  const handleGenerateMock = async () => {
    setIsSyncing(true)
    try {
      await actions.generateMockData(14)
      await refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSyncing(false)
    }
  }

  const handleOpenLogin = async () => {
    setIsLoginOpen(true)
    try {
      const res = await actions.startLogin()
      if (res.ok && res.value.ok) {
        setLoginData({
          qrBase64: res.value.qrBase64,
          qrUrl: res.value.qrUrl,
          loginUrl: res.value.loginUrl,
        })
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const today = summary?.today ?? null
  const score = summary?.healthScore ?? 85
  const insights = summary?.insights ?? []

  return (
    <div className="dsh-health-container">
      {/* Header & sync controls */}
      <SyncStatusBar
        status={status}
        isSyncing={isSyncing}
        onSync={handleSync}
        onGenerateMock={handleGenerateMock}
        onOpenLogin={handleOpenLogin}
        t={t}
      />

      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '13px',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Top Row: Activity Rings & AI Health Insights */}
      <div className="dsh-health-grid-row">
        <ActivityRings
          goals={today?.goals ?? { stepsGoal: 10000, stepsAchieved: 0, caloriesGoal: 500, caloriesAchieved: 0, intensityGoal: 30, intensityAchieved: 0 }}
          steps={today?.steps ?? 0}
          calories={today?.activityCalories ?? 0}
          intensity={today?.intensityMinutes ?? 0}
          t={t}
        />

        {/* AI Health Insights Card */}
        <div className="dsh-health-insights-card">
          <div className="dsh-health-insight-score">
            <div
              className="dsh-health-score-circle"
              style={{ '--score-pct': `${score}%` } as React.CSSProperties}
            >
              <div className="dsh-health-score-inner">{score}</div>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>
                {t('insights.title')}
              </div>
              <div style={{ fontSize: '12px', color: '#a5b4fc', marginTop: '2px' }}>
                {score >= 80 ? t('insights.healthy') : t('insights.attention')}
              </div>
            </div>
          </div>

          <ul className="dsh-health-insight-list">
            {insights.map((item, idx) => (
              <li key={idx} className="dsh-health-insight-item">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle Row: Sleep Quality & Heart Rate */}
      <div className="dsh-health-grid-row">
        <SleepCard metrics={today} t={t} />
        <HeartRateCard metrics={today} t={t} />
      </div>

      {/* Bottom Row: Additional Health Metrics */}
      <MetricGrid metrics={today} t={t} />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        qrBase64={loginData.qrBase64}
        qrUrl={loginData.qrUrl}
        loginUrl={loginData.loginUrl}
        onClose={() => setIsLoginOpen(false)}
        t={t}
      />
    </div>
  )
}
