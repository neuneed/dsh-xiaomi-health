import React from 'react'
import type { DailyMetrics } from '../../types.ts'
import type { Translate } from '../locales.ts'

interface Props {
  metrics: DailyMetrics | null
  t: Translate
}

export const MetricGrid: React.FC<Props> = ({ metrics, t }) => {
  const spo2 = metrics?.spo2Latest ?? metrics?.spo2Avg ?? 98
  const standCount = metrics?.validStandCount ?? 12
  const distanceKm = metrics?.distanceMeters ? (metrics.distanceMeters / 1000).toFixed(2) : '5.2'
  const calories = metrics?.activityCalories ?? 420

  return (
    <div className="dsh-health-mini-grid">
      {/* SpO2 */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span>🫁</span> {t('metrics.spo2')}
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#38bdf8' }}>
          {spo2}%
        </div>
        <div style={{ fontSize: '11px', color: '#10b981' }}>
          ● {t('metrics.spo2Normal')}
        </div>
      </div>

      {/* Valid Standing */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span>🧍</span> {t('metrics.stand')}
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#00c7be' }}>
          {t('metrics.standHours', { count: standCount })}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          Target: 12 hrs
        </div>
      </div>

      {/* Distance */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span>📍</span> Distance
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#a855f7' }}>
          {distanceKm} km
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          {calories} kcal burned
        </div>
      </div>

      {/* Weight & BMI */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span>⚖️</span> {t('metrics.weight')}
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#f59e0b' }}>
          68.0 kg
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          BMI: 22.2 (Normal)
        </div>
      </div>
    </div>
  )
}
