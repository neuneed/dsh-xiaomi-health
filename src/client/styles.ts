/**
 * Modern Glassmorphic CSS styling for Xiaomi Health Dashboard.
 */

export const HEALTH_STYLES = `
.dsh-health-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #f1f5f9;
  background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0b1329 100%);
  border-radius: 16px;
  min-height: 100%;
  box-sizing: border-box;
}

/* Header & Status Bar */
.dsh-health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dsh-health-header-left h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dsh-health-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #94a3b8;
}

.dsh-health-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dsh-health-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  backdrop-filter: blur(8px);
}

.dsh-health-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.dsh-health-btn-primary {
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.dsh-health-btn-primary:hover {
  background: linear-gradient(135deg, #0284c7, #4f46e5);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
}

.dsh-health-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dsh-health-badge-mock {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.dsh-health-badge-live {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* Glassmorphic Cards */
.dsh-health-grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.dsh-health-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: border-color 0.2s ease;
}

.dsh-health-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
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
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Activity Rings */
.dsh-health-rings-wrap {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
}

.dsh-health-ring-svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
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
}

.dsh-health-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.dsh-health-dot-calories { background: #ff2d55; box-shadow: 0 0 8px rgba(255, 45, 85, 0.6); }
.dsh-health-dot-steps { background: #34c759; box-shadow: 0 0 8px rgba(52, 199, 89, 0.6); }
.dsh-health-dot-intensity { background: #00c7be; box-shadow: 0 0 8px rgba(0, 199, 190, 0.6); }

/* Sleep Architecture */
.dsh-health-sleep-big {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.dsh-health-sleep-val {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
}

.dsh-health-score-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.35);
}

.dsh-health-sleep-bar {
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
}

.dsh-health-bar-deep { background: #6366f1; }
.dsh-health-bar-light { background: #38bdf8; }
.dsh-health-bar-rem { background: #a855f7; }
.dsh-health-bar-awake { background: #f43f5e; }

.dsh-health-sleep-stages {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
}

.dsh-health-stage-val {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  margin-top: 2px;
}

/* Heart Rate & Zones */
.dsh-health-hr-big {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.dsh-health-bpm-val {
  font-size: 32px;
  font-weight: 700;
  color: #f43f5e;
}

.dsh-health-zones-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  margin: 10px 0;
}

.dsh-health-zone-warmup { background: #38bdf8; }
.dsh-health-zone-fatburn { background: #34d399; }
.dsh-health-zone-aerobic { background: #fbbf24; }
.dsh-health-zone-anaerobic { background: #f97316; }
.dsh-health-zone-extreme { background: #ef4444; }

/* Metrics Mini Cards */
.dsh-health-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.dsh-health-mini-card {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dsh-health-mini-label {
  font-size: 12px;
  color: #94a3b8;
}

.dsh-health-mini-val {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
}

/* AI Insights Banner */
.dsh-health-insights-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(49, 46, 129, 0.4) 100%);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}

.dsh-health-insight-score {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.dsh-health-score-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: conic-gradient(#6366f1 var(--score-pct), rgba(255, 255, 255, 0.1) 0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);
}

.dsh-health-score-inner {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dsh-health-insight-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsh-health-insight-item {
  font-size: 13px;
  color: #cbd5e1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
}

/* QR Login Modal */
.dsh-health-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.dsh-health-modal {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.dsh-health-qr-box {
  margin: 16px auto;
  padding: 12px;
  background: #ffffff;
  border-radius: 12px;
  display: inline-block;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
  if (document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = HEALTH_STYLES
  document.head.appendChild(el)
}
