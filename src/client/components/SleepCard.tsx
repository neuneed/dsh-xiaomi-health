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
          <span>🌙</span> {t('sleep.title')}
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
        <div className="dsh-health-bar-light" style={{ width: `${lightPct}%` }} title={`Light: ${lightMin}m`} />
        <div className="dsh-health-bar-rem" style={{ width: `${remPct}%` }} title={`REM: ${remMin}m`} />
        <div className="dsh-health-bar-awake" style={{ width: `${awakePct}%` }} title={`Awake: ${awakeMin}m`} />
      </div>

      <div className="dsh-health-sleep-stages">
        <div>
          <span>{t('sleep.deep')}</span>
          <div className="dsh-health-stage-val" style={{ color: '#818cf8' }}>
            {deepMin}m ({Math.round(deepPct)}%)
          </div>
        </div>
        <div>
          <span>{t('sleep.light')}</span>
          <div className="dsh-health-stage-val" style={{ color: '#38bdf8' }}>
            {lightMin}m ({Math.round(lightPct)}%)
          </div>
        </div>
        <div>
          <span>{t('sleep.rem')}</span>
          <div className="dsh-health-stage-val" style={{ color: '#c084fc' }}>
            {remMin}m ({Math.round(remPct)}%)
          </div>
        </div>
        <div>
          <span>{t('sleep.awake')}</span>
          <div className="dsh-health-stage-val" style={{ color: '#fb7185' }}>
            {awakeMin}m
          </div>
        </div>
      </div>
    </div>
  )
}
