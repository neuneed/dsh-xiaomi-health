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
    ? new Date(status.lastSyncTs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const todayStr = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="dsh-health-header">
      <div className="dsh-health-header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          {todayStr} •{' '}
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
            title="生成 14 天逼真演示生理数据"
          >
            🎲 {t('dashboard.generateMock')}
          </button>
        )}

        <button
          className="dsh-health-btn"
          onClick={onOpenLogin}
          title="绑定小米运动健康账号"
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
              <span>⏳</span>
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
