import React from 'react'
import type { DailyMetrics } from '../../types.ts'
import type { Translate } from '../locales.ts'

interface Props {
  metrics: DailyMetrics | null
  t: Translate
}

export const HeartRateCard: React.FC<Props> = ({ metrics, t }) => {
  const latestBpm = metrics?.hrLatest ?? metrics?.hrAvg ?? 72
  const restingBpm = metrics?.hrResting ?? 60
  const minHr = metrics?.hrMin ?? 52
  const maxHr = metrics?.hrMax ?? 135

  const zones = metrics?.hrZones ?? {
    warmupMinutes: 25,
    fatBurnMinutes: 20,
    aerobicMinutes: 10,
    anaerobicMinutes: 2,
    extremeMinutes: 0,
  }

  const totalZoneMin = Math.max(
    1,
    zones.warmupMinutes +
      zones.fatBurnMinutes +
      zones.aerobicMinutes +
      zones.anaerobicMinutes +
      zones.extremeMinutes,
  )

  const warmupPct = (zones.warmupMinutes / totalZoneMin) * 100
  const fatburnPct = (zones.fatBurnMinutes / totalZoneMin) * 100
  const aerobicPct = (zones.aerobicMinutes / totalZoneMin) * 100
  const anaerobicPct = (zones.anaerobicMinutes / totalZoneMin) * 100
  const extremePct = (zones.extremeMinutes / totalZoneMin) * 100

  return (
    <div className="dsh-health-card">
      <div className="dsh-health-card-header">
        <span className="dsh-health-card-title">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-heart">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          {t('heartRate.title')}
        </span>
        <span style={{ fontSize: '12px', color: '#8e8e93', fontWeight: 500 }}>
          {t('heartRate.resting')}: <strong style={{ color: '#ffffff' }}>{restingBpm}</strong> {t('heartRate.bpm')}
        </span>
      </div>

      <div className="dsh-health-hr-big">
        <span className="dsh-health-bpm-val">{latestBpm}</span>
        <span style={{ fontSize: '15px', color: '#8e8e93', fontWeight: 600 }}>{t('heartRate.bpm')}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8e8e93', margin: '4px 0 8px 0' }}>
        <span>{t('heartRate.range')}: {minHr} - {maxHr} {t('heartRate.bpm')}</span>
        <span>{t('heartRate.zones')}</span>
      </div>

      {/* Heart rate zones visual bar */}
      <div className="dsh-health-zones-bar">
        <div className="dsh-health-zone-warmup" style={{ width: `${warmupPct}%` }} title={`Warmup: ${zones.warmupMinutes}m`} />
        <div className="dsh-health-zone-fatburn" style={{ width: `${fatburnPct}%` }} title={`Fat burn: ${zones.fatBurnMinutes}m`} />
        <div className="dsh-health-zone-aerobic" style={{ width: `${aerobicPct}%` }} title={`Aerobic: ${zones.aerobicMinutes}m`} />
        <div className="dsh-health-zone-anaerobic" style={{ width: `${anaerobicPct}%` }} title={`Anaerobic: ${zones.anaerobicMinutes}m`} />
        <div className="dsh-health-zone-extreme" style={{ width: `${extremePct}%` }} title={`Peak: ${zones.extremeMinutes}m`} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#636366' }}>
        <span>{t('heartRate.zoneWarmup')}</span>
        <span>{t('heartRate.zoneFatBurn')}</span>
        <span>{t('heartRate.zoneAerobic')}</span>
        <span>{t('heartRate.zoneExtreme')}</span>
      </div>
    </div>
  )
}
