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
          <span style={{ color: '#f43f5e' }}>❤️</span> {t('heartRate.title')}
        </span>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          {t('heartRate.resting')}: <strong style={{ color: '#f1f5f9' }}>{restingBpm}</strong> {t('heartRate.bpm')}
        </span>
      </div>

      <div className="dsh-health-hr-big">
        <span className="dsh-health-bpm-val">{latestBpm}</span>
        <span style={{ fontSize: '14px', color: '#94a3b8' }}>{t('heartRate.bpm')}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', margin: '4px 0' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
        <span>{t('heartRate.zoneWarmup')}</span>
        <span>{t('heartRate.zoneFatBurn')}</span>
        <span>{t('heartRate.zoneAerobic')}</span>
        <span>{t('heartRate.zoneExtreme')}</span>
      </div>
    </div>
  )
}
