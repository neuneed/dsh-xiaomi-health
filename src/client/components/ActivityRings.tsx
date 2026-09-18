import React from 'react'
import type { ActivityGoals } from '../../types.ts'
import type { Translate } from '../locales.ts'

interface Props {
  goals: ActivityGoals
  steps: number | null
  calories: number | null
  intensity: number | null
  t: Translate
}

export const ActivityRings: React.FC<Props> = ({ goals, steps, calories, intensity, t }) => {
  const curSteps = steps ?? 0
  const curCalories = calories ?? 0
  const curIntensity = intensity ?? 0

  const calGoal = goals.caloriesGoal || 500
  const stepGoal = goals.stepsGoal || 10000
  const intGoal = goals.intensityGoal || 30

  const calPct = Math.min(1, curCalories / calGoal)
  const stepPct = Math.min(1, curSteps / stepGoal)
  const intPct = Math.min(1, curIntensity / intGoal)

  // Radii for Apple concentric rings
  const rCal = 56
  const rInt = 44
  const rStep = 32

  const circCal = 2 * Math.PI * rCal
  const circInt = 2 * Math.PI * rInt
  const circStep = 2 * Math.PI * rStep

  return (
    <div className="dsh-health-card">
      <div className="dsh-health-card-header">
        <span className="dsh-health-card-title">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-red">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <circle cx="12" cy="12" r="5" />
            </svg>
          </span>
          {t('rings.title')}
        </span>
        <span style={{ fontSize: '12px', color: '#8e8e93', fontWeight: 500 }}>
          {curSteps.toLocaleString()} {t('rings.stepsUnit')}
        </span>
      </div>

      <div className="dsh-health-rings-wrap">
        <svg className="dsh-health-ring-svg" width="140" height="140" viewBox="0 0 140 140">
          {/* Background tracks with 20% opacity */}
          <circle cx="70" cy="70" r={rCal} fill="none" stroke="rgba(250, 17, 79, 0.2)" strokeWidth="10" />
          <circle cx="70" cy="70" r={rInt} fill="none" stroke="rgba(161, 255, 0, 0.2)" strokeWidth="10" />
          <circle cx="70" cy="70" r={rStep} fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="10" />

          {/* Active progress arcs */}
          <circle
            cx="70"
            cy="70"
            r={rCal}
            fill="none"
            stroke="#fa114f"
            strokeWidth="10"
            strokeDasharray={circCal}
            strokeDashoffset={circCal * (1 - calPct)}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
          <circle
            cx="70"
            cy="70"
            r={rInt}
            fill="none"
            stroke="#a1ff00"
            strokeWidth="10"
            strokeDasharray={circInt}
            strokeDashoffset={circInt * (1 - intPct)}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
          <circle
            cx="70"
            cy="70"
            r={rStep}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="10"
            strokeDasharray={circStep}
            strokeDashoffset={circStep * (1 - stepPct)}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </svg>

        <div className="dsh-health-ring-legend">
          {/* Move / Calories */}
          <div className="dsh-health-legend-item">
            <span>
              <span className="dsh-health-legend-dot dsh-health-dot-calories"></span>
              {t('rings.calories')}
            </span>
            <strong style={{ color: '#fa114f', fontVariantNumeric: 'tabular-nums' }}>
              {curCalories} <span style={{ fontSize: '11px', color: '#8e8e93', fontWeight: 'normal' }}>/ {calGoal} {t('rings.caloriesUnit')}</span>
            </strong>
          </div>

          {/* Exercise / Intensity */}
          <div className="dsh-health-legend-item">
            <span>
              <span className="dsh-health-legend-dot dsh-health-dot-steps"></span>
              {t('rings.intensity')}
            </span>
            <strong style={{ color: '#a1ff00', fontVariantNumeric: 'tabular-nums' }}>
              {curIntensity} <span style={{ fontSize: '11px', color: '#8e8e93', fontWeight: 'normal' }}>/ {intGoal} {t('rings.intensityUnit')}</span>
            </strong>
          </div>

          {/* Steps / Stand */}
          <div className="dsh-health-legend-item">
            <span>
              <span className="dsh-health-legend-dot dsh-health-dot-intensity"></span>
              {t('rings.steps')}
            </span>
            <strong style={{ color: '#00f0ff', fontVariantNumeric: 'tabular-nums' }}>
              {curSteps.toLocaleString()} <span style={{ fontSize: '11px', color: '#8e8e93', fontWeight: 'normal' }}>/ {stepGoal.toLocaleString()} {t('rings.stepsUnit')}</span>
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}
