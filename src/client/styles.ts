/**
 * Apple Health Style CSS styling for Xiaomi Health Dashboard in DeepSeek Harness.
 *
 * Implements Apple Health Design System:
 * - OLED deep black canvas (#000000) & Apple grouped card background (#1C1C1E / #2C2C2E)
 * - San Francisco typography hierarchy with tabular figures
 * - Iconic Apple Health color tokens:
 *   - Move / Activity: #FA114F (iOS Move Red-Pink)
 *   - Exercise: #A1FF00 (iOS Exercise Lime)
 *   - Stand: #00F0FF (iOS Stand Cyan)
 *   - Heart Rate: #FF2D55 (Heart Vivid Red)
 *   - Sleep: #63E6E2 (Aqua/Teal) & #5E5CE6 (Sleep Indigo)
 *   - Blood Oxygen / General: #0A84FF (Apple System Blue)
 *   - Energy / Weight: #FF9F0A (Apple Orange)
 */

export const HEALTH_STYLES = `
/* Apple Health Main Container */
.dsh-health-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro Rounded", "Helvetica Neue", Arial, sans-serif;
  color: #ffffff;
  background: #000000;
  border-radius: 20px;
  min-height: 100%;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

/* Header & Status Bar */
.dsh-health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dsh-health-header-left h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.dsh-health-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #8e8e93;
}

.dsh-health-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Apple Capsule Buttons */
.dsh-health-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  backdrop-filter: blur(16px);
}

.dsh-health-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.24);
  transform: translateY(-1px);
}

.dsh-health-btn:active {
  transform: translateY(0);
}

.dsh-health-btn-primary {
  background: #0a84ff;
  border: none;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(10, 132, 255, 0.35);
}

.dsh-health-btn-primary:hover {
  background: #0071e3;
  box-shadow: 0 4px 14px rgba(10, 132, 255, 0.5);
}

/* Status Badges */
.dsh-health-badge {
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.dsh-health-badge-mock {
  background: rgba(255, 214, 10, 0.15);
  color: #ffd60a;
  border: 1px solid rgba(255, 214, 10, 0.25);
}

.dsh-health-badge-live {
  background: rgba(48, 209, 88, 0.15);
  color: #30d158;
  border: 1px solid rgba(48, 209, 88, 0.25);
}

/* Apple Health Grouped Cards */
.dsh-health-grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 16px;
}

.dsh-health-card {
  background: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.dsh-health-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.dsh-health-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.dsh-health-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dsh-health-icon-badge {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.dsh-health-icon-badge-red {
  background: rgba(250, 17, 79, 0.15);
  color: #fa114f;
}

.dsh-health-icon-badge-heart {
  background: rgba(255, 45, 85, 0.15);
  color: #ff2d55;
}

.dsh-health-icon-badge-sleep {
  background: rgba(99, 230, 226, 0.15);
  color: #63e6e2;
}

.dsh-health-icon-badge-blue {
  background: rgba(10, 132, 255, 0.15);
  color: #0a84ff;
}

.dsh-health-icon-badge-green {
  background: rgba(48, 209, 88, 0.15);
  color: #30d158;
}

.dsh-health-icon-badge-orange {
  background: rgba(255, 159, 10, 0.15);
  color: #ff9f0a;
}

/* Activity Rings (Exact Apple Watch Rings) */
.dsh-health-rings-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.dsh-health-ring-svg {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
  flex-shrink: 0;
}

.dsh-health-ring-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.dsh-health-legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 10px;
  background: #2c2c2e;
  border-radius: 10px;
}

.dsh-health-legend-item span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #aeaeb2;
}

.dsh-health-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dsh-health-dot-calories { background: #fa114f; box-shadow: 0 0 6px rgba(250, 17, 79, 0.6); }
.dsh-health-dot-steps { background: #a1ff00; box-shadow: 0 0 6px rgba(161, 255, 0, 0.6); }
.dsh-health-dot-intensity { background: #00f0ff; box-shadow: 0 0 6px rgba(0, 240, 255, 0.6); }

/* Sleep Architecture (Apple Health Sleep) */
.dsh-health-sleep-big {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.dsh-health-sleep-val {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
}

.dsh-health-score-pill {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(99, 230, 226, 0.12);
  color: #63e6e2;
  border: 1px solid rgba(99, 230, 226, 0.25);
}

.dsh-health-sleep-bar {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background: #2c2c2e;
  margin-bottom: 14px;
}

.dsh-health-bar-deep { background: #3634a3; }
.dsh-health-bar-light { background: #5e5ce6; }
.dsh-health-bar-rem { background: #63e6e2; }
.dsh-health-bar-awake { background: #ff453a; }

.dsh-health-sleep-stages {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  text-align: center;
}

.dsh-health-stage-box {
  background: #2c2c2e;
  border-radius: 10px;
  padding: 8px 4px;
  font-size: 11px;
  color: #8e8e93;
}

.dsh-health-stage-val {
  font-size: 13px;
  font-weight: 700;
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
}

/* Heart Rate & Zones (Apple Health Heart) */
.dsh-health-hr-big {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.dsh-health-bpm-val {
  font-size: 36px;
  font-weight: 700;
  color: #ff2d55;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
}

.dsh-health-zones-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #2c2c2e;
  margin: 12px 0 8px 0;
}

.dsh-health-zone-warmup { background: #30d158; }
.dsh-health-zone-fatburn { background: #ffd60a; }
.dsh-health-zone-aerobic { background: #ff9f0a; }
.dsh-health-zone-anaerobic { background: #ff453a; }
.dsh-health-zone-extreme { background: #bf5af2; }

/* Metrics Summary Grid (Apple Health Tiles) */
.dsh-health-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.dsh-health-mini-card {
  background: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}

.dsh-health-mini-card:hover {
  transform: translateY(-1px);
}

.dsh-health-mini-label {
  font-size: 12px;
  font-weight: 600;
  color: #8e8e93;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dsh-health-mini-val {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
}

.dsh-health-mini-sub {
  font-size: 11px;
  color: #8e8e93;
}

/* Apple Health Highlights & AI Insights */
.dsh-health-insights-card {
  background: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.dsh-health-insight-score {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.dsh-health-score-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(#0a84ff var(--score-pct), #2c2c2e 0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
}

.dsh-health-score-inner {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #1c1c1e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dsh-health-insight-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsh-health-insight-item {
  font-size: 13px;
  color: #d1d1d6;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
  padding: 10px 12px;
  background: #2c2c2e;
  border-radius: 12px;
}

.dsh-health-insight-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a84ff;
  margin-top: 7px;
  flex-shrink: 0;
}

/* QR Login Modal (Apple iOS Sheet) */
.dsh-health-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.dsh-health-modal {
  background: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 28px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7);
  text-align: center;
}

.dsh-health-qr-box {
  margin: 18px auto;
  padding: 14px;
  background: #ffffff;
  border-radius: 16px;
  display: inline-block;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.dsh-health-qr-box img {
  display: block;
  width: 200px;
  height: 200px;
}
`

export function adoptStyles(): void {
  if (typeof document === 'undefined') return
  const id = 'dsh-xiaomi-health-styles'
  const existing = document.getElementById(id)
  if (existing) {
    existing.textContent = HEALTH_STYLES
    return
  }
  const el = document.createElement('style')
  el.id = id
  el.textContent = HEALTH_STYLES
  document.head.appendChild(el)
}
