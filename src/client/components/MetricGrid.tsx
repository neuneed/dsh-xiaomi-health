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
          <span className="dsh-health-icon-badge dsh-health-icon-badge-blue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </span>
          {t('metrics.spo2')}
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#0a84ff' }}>
          {spo2}%
        </div>
        <div className="dsh-health-mini-sub" style={{ color: '#30d158', fontWeight: 500 }}>
          ● {t('metrics.spo2Normal')}
        </div>
      </div>

      {/* Valid Standing */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-green">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="4" r="2" />
              <path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-3.06c-1.3 0-1.97.72-2.36 1.11L4 12.25l1.41 1.41L9 10.08V22h2v-6h2v6h2V10.08l3.59 3.58L20 12.25l-4.11-4.14z" />
            </svg>
          </span>
          {t('metrics.stand')}
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#00f0ff' }}>
          {t('metrics.standHours', { count: standCount })}
        </div>
        <div className="dsh-health-mini-sub">
          目标: 12 小时
        </div>
      </div>

      {/* Distance */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-green">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z" />
            </svg>
          </span>
          步行+跑步距离
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#30d158' }}>
          {distanceKm} <span style={{ fontSize: '14px', color: '#8e8e93', fontWeight: 500 }}>公里</span>
        </div>
        <div className="dsh-health-mini-sub">
          消耗 {calories} 千卡
        </div>
      </div>

      {/* Weight & BMI */}
      <div className="dsh-health-mini-card">
        <div className="dsh-health-mini-label">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-orange">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
            </svg>
          </span>
          {t('metrics.weight')}
        </div>
        <div className="dsh-health-mini-val" style={{ color: '#ff9f0a' }}>
          68.0 <span style={{ fontSize: '14px', color: '#8e8e93', fontWeight: 500 }}>公斤</span>
        </div>
        <div className="dsh-health-mini-sub">
          BMI 22.2 (正常)
        </div>
      </div>
    </div>
  )
}
