import React from 'react'
import type { DailyMetrics } from '../../types.ts'
import type { Translate } from '../locales.ts'

interface Props {
  metrics: DailyMetrics | null
  t: Translate
}

export const SleepCard: React.FC<Props> = ({ metrics, t }) => {
  const totalMin = metrics?.sleepTotalMinutes ?? 0
  const deepMin = metrics?.sleepDeepMinutes ?? 0
  const lightMin = metrics?.sleepLightMinutes ?? 0
  const remMin = metrics?.sleepRemMinutes ?? 0
  const awakeMin = metrics?.sleepAwakeMinutes ?? 0
  const score = metrics?.sleepScore ?? null

  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60

  const safeTotal = Math.max(1, totalMin)
  const deepPct = (deepMin / safeTotal) * 100
  const lightPct = (lightMin / safeTotal) * 100
  const remPct = (remMin / safeTotal) * 100
  const awakePct = (awakeMin / safeTotal) * 100

  return (
    <div className="dsh-health-card">
      <div className="dsh-health-card-header">
        <span className="dsh-health-card-title">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-sleep">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.3 2a10 10 0 0 0-1.9 20 10 10 0 0 0 8.6-4.9 1 1 0 0 0-1-1.5 8 8 0 1 1-7.2-12.6 1 1 0 0 0 1.5-1z" />
            </svg>
          </span>
          {t('sleep.title')}
        </span>
        {score !== null && (
          <span className="dsh-health-score-pill">
            {t('sleep.score')} {score}
          </span>
        )}
      </div>

      <div className="dsh-health-sleep-big">
        <span className="dsh-health-sleep-val">
          {t('sleep.hours', { h: hours, m: mins })}
        </span>
      </div>

      {/* Sleep stage proportional bar */}
      <div className="dsh-health-sleep-bar">
        <div className="dsh-health-bar-deep" style={{ width: `${deepPct}%` }} title={`Deep: ${deepMin}m`} />
        <div className="dsh-health-bar-light" style={{ width: `${lightPct}%` }} title={`Core: ${lightMin}m`} />
        <div className="dsh-health-bar-rem" style={{ width: `${remPct}%` }} title={`REM: ${remMin}m`} />
        <div className="dsh-health-bar-awake" style={{ width: `${awakePct}%` }} title={`Awake: ${awakeMin}m`} />
      </div>

      <div className="dsh-health-sleep-stages">
        <div className="dsh-health-stage-box">
          <div>{t('sleep.deep')}</div>
          <div className="dsh-health-stage-val" style={{ color: '#8e8e93' }}>
            {deepMin}m ({Math.round(deepPct)}%)
          </div>
        </div>
        <div className="dsh-health-stage-box">
          <div>{t('sleep.light')}</div>
          <div className="dsh-health-stage-val" style={{ color: '#5e5ce6' }}>
            {lightMin}m ({Math.round(lightPct)}%)
          </div>
        </div>
        <div className="dsh-health-stage-box">
          <div>{t('sleep.rem')}</div>
          <div className="dsh-health-stage-val" style={{ color: '#63e6e2' }}>
            {remMin}m ({Math.round(remPct)}%)
          </div>
        </div>
        <div className="dsh-health-stage-box">
          <div>{t('sleep.awake')}</div>
          <div className="dsh-health-stage-val" style={{ color: '#ff453a' }}>
            {awakeMin}m
          </div>
        </div>
      </div>
    </div>
  )
}
