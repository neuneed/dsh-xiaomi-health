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

  const calPct = Math.min(1, curCalories / (goals.caloriesGoal || 500))
  const stepPct = Math.min(1, curSteps / (goals.stepsGoal || 10000))
  const intPct = Math.min(1, curIntensity / (goals.intensityGoal || 30))

  // Radius for outer, middle, inner
  const rCal = 54
  const rStep = 42
  const rInt = 30

  const circCal = 2 * Math.PI * rCal
  const circStep = 2 * Math.PI * rStep
  const circInt = 2 * Math.PI * rInt

  return (
    <div className="dsh-health-card">
      <div className="dsh-health-card-header">
        <span className="dsh-health-card-title">
          <span>🎯</span> {t('rings.title')}
        </span>
      </div>
      <div className="dsh-health-rings-wrap">
        <svg className="dsh-health-ring-svg" width="130" height="130" viewBox="0 0 130 130">
          {/* Background tracks */}
          <circle cx="65" cy="65" r={rCal} fill="none" stroke="rgba(255, 45, 85, 0.15)" strokeWidth="9" />
          <circle cx="65" cy="65" r={rStep} fill="none" stroke="rgba(52, 199, 89, 0.15)" strokeWidth="9" />
          <circle cx="65" cy="65" r={rInt} fill="none" stroke="rgba(0, 199, 190, 0.15)" strokeWidth="9" />

          {/* Active progress arcs */}
          <circle
            cx="65"
            cy="65"
            r={rCal}
            fill="none"
            stroke="#ff2d55"
            strokeWidth="9"
            strokeDasharray={circCal}
            strokeDashoffset={circCal * (1 - calPct)}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
          />
          <circle
            cx="65"
            cy="65"
            r={rStep}
            fill="none"
            stroke="#34c759"
            strokeWidth="9"
            strokeDasharray={circStep}
            strokeDashoffset={circStep * (1 - stepPct)}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
          />
          <circle
            cx="65"
            cy="65"
            r={rInt}
            fill="none"
            stroke="#00c7be"
            strokeWidth="9"
            strokeDasharray={circInt}
            strokeDashoffset={circInt * (1 - intPct)}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
          />
        </svg>

        <div className="dsh-health-ring-legend">
          <div className="dsh-health-legend-item">
            <span>
              <span className="dsh-health-legend-dot dsh-health-dot-calories"></span>
              {t('rings.calories')}
            </span>
            <strong>
              {curCalories} / {goals.caloriesGoal} {t('rings.caloriesUnit')}
            </strong>
          </div>
          <div className="dsh-health-legend-item">
            <span>
              <span className="dsh-health-legend-dot dsh-health-dot-steps"></span>
              {t('rings.steps')}
            </span>
            <strong>
              {curSteps.toLocaleString()} / {goals.stepsGoal.toLocaleString()} {t('rings.stepsUnit')}
            </strong>
          </div>
          <div className="dsh-health-legend-item">
            <span>
              <span className="dsh-health-legend-dot dsh-health-dot-intensity"></span>
              {t('rings.intensity')}
            </span>
            <strong>
              {curIntensity} / {goals.intensityGoal} {t('rings.intensityUnit')}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}
