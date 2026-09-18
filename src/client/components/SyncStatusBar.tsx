import React from 'react'
import type { PluginStatus } from '../../types.ts'
import type { Translate } from '../locales.ts'

interface Props {
  status: PluginStatus | null
  isSyncing: boolean
  onSync: () => void
  onGenerateMock: () => void
  onOpenLogin: () => void
  t: Translate
}

export const SyncStatusBar: React.FC<Props> = ({
  status,
  isSyncing,
  onSync,
  onGenerateMock,
  onOpenLogin,
  t,
}) => {
  const isMock = status?.mockMode ?? true
  const lastSyncTime = status?.lastSyncTs
    ? new Date(status.lastSyncTs * 1000).toLocaleTimeString()
    : null

  return (
    <div className="dsh-health-header">
      <div className="dsh-health-header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2>{t('dashboard.title')}</h2>
          <span
            className={`dsh-health-badge ${
              isMock ? 'dsh-health-badge-mock' : 'dsh-health-badge-live'
            }`}
          >
            {isMock ? t('dashboard.mockModeBadge') : t('dashboard.liveModeBadge')}
          </span>
        </div>
        <p className="dsh-health-subtitle">
          {t('dashboard.subtitle')} •{' '}
          {lastSyncTime
            ? t('dashboard.lastSync', { time: lastSyncTime })
            : t('dashboard.neverSynced')}
        </p>
      </div>

      <div className="dsh-health-header-actions">
        {isMock && (
          <button
            className="dsh-health-btn"
            onClick={onGenerateMock}
            title="Populate test database with 14 days of realistic data"
          >
            🎲 {t('dashboard.generateMock')}
          </button>
        )}

        <button
          className="dsh-health-btn"
          onClick={onOpenLogin}
          title="Login with Xiaomi Health QR Code"
        >
          🔑 {t('dashboard.loginPrompt')}
        </button>

        <button
          className="dsh-health-btn dsh-health-btn-primary"
          onClick={onSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <>
              <span className="dsh-health-spinner">🔄</span>
              {t('dashboard.syncing')}
            </>
          ) : (
            <>
              <span>⚡</span>
              {t('dashboard.syncNow')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
