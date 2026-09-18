/**
 * Client i18n dictionaries for dsh-xiaomi-health.
 */
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'

export const zh = {
  'dashboard.title': '小米运动健康监控',
  'dashboard.navTitle': '健康',
  'dashboard.subtitle': '实时同步穿戴设备健康指标与 AI 洞察',
  'dashboard.syncNow': '立即同步',
  'dashboard.syncing': '正在同步…',
  'dashboard.generateMock': '生成演示数据',
  'dashboard.loginPrompt': '绑定小米账号',
  'dashboard.loginSuccess': '账号绑定成功',
  'dashboard.lastSync': '上次同步: {time}',
  'dashboard.neverSynced': '尚未同步',
  'dashboard.mockModeBadge': '演示模式',
  'dashboard.liveModeBadge': '实时同步',
  'dashboard.todayTab': '今日概览',
  'dashboard.sevenDaysTab': '7日趋势',
  'dashboard.thirtyDaysTab': '30日分析',

  'rings.title': '每日活力三环',
  'rings.steps': '活动步数',
  'rings.stepsUnit': '步',
  'rings.calories': '活动消耗',
  'rings.caloriesUnit': '千卡',
  'rings.intensity': '中高强度',
  'rings.intensityUnit': '分钟',
  'rings.goalAchieved': '目标达成',

  'sleep.title': '睡眠质量分析',
  'sleep.score': '睡眠评分',
  'sleep.totalDuration': '总睡眠时长',
  'sleep.hours': '{h}小时{m}分',
  'sleep.deep': '深睡',
  'sleep.light': '浅睡',
  'sleep.rem': '快速眼动 (REM)',
  'sleep.awake': '清醒',
  'sleep.bedtime': '入睡时间',
  'sleep.wakeTime': '醒来时间',
  'sleep.avgHr': '睡眠均率',
  'sleep.avgSpo2': '睡眠血氧',
  'sleep.nap': '零星小睡',

  'heartRate.title': '心率与心血管',
  'heartRate.latest': '当前/最新心率',
  'heartRate.bpm': 'BPM',
  'heartRate.resting': '静息心率',
  'heartRate.range': '心率区间',
  'heartRate.min': '最低',
  'heartRate.max': '最高',
  'heartRate.zones': '心率区间分布',
  'heartRate.zoneWarmup': '热身放松',
  'heartRate.zoneFatBurn': '燃脂运动',
  'heartRate.zoneAerobic': '有氧耐力',
  'heartRate.zoneAnaerobic': '无氧极限',
  'heartRate.zoneExtreme': '极限冲刺',

  'metrics.spo2': '血氧饱和度 (SpO2)',
  'metrics.spo2Normal': '正常',
  'metrics.spo2Low': '偏低注意',
  'metrics.stand': '有效站立',
  'metrics.standHours': '{count}小时',
  'metrics.bloodPressure': '血压检测',
  'metrics.weight': '体重与体脂',
  'metrics.bmi': 'BMI',
  'metrics.bodyFat': '体脂率',

  'insights.title': 'AI 健康智能洞察',
  'insights.scoreLabel': '综合健康指数',
  'insights.healthy': '健康状态优良',
  'insights.attention': '需注意生活作息',

  'loginModal.title': '绑定小米健康 (Mi Fitness) 账号',
  'loginModal.step1': '1. 请使用「小米运动健康」或「小米账号」App 扫描下方二维码：',
  'loginModal.step2': '2. 确认登录后，插件将自动完成凭证 STS 握手并持久化。',
  'loginModal.browserLink': '或点击在浏览器中打开授权链接',
  'loginModal.waitingScan': '等待 App 扫码确认…',
  'loginModal.close': '关闭',
} satisfies Record<string, string>

export type HealthLocaleKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-xiaomi-health': HealthLocaleKey
  }
}

export const en: Record<HealthLocaleKey, string> = {
  'dashboard.title': 'Xiaomi Health Monitor',
  'dashboard.navTitle': 'Health',
  'dashboard.subtitle': 'Real-time wearable health metrics & AI insights',
  'dashboard.syncNow': 'Sync Now',
  'dashboard.syncing': 'Syncing…',
  'dashboard.generateMock': 'Generate Demo Data',
  'dashboard.loginPrompt': 'Connect Xiaomi Account',
  'dashboard.loginSuccess': 'Account Connected',
  'dashboard.lastSync': 'Last sync: {time}',
  'dashboard.neverSynced': 'Never synced',
  'dashboard.mockModeBadge': 'Demo Mode',
  'dashboard.liveModeBadge': 'Live Mode',
  'dashboard.todayTab': 'Today Overview',
  'dashboard.sevenDaysTab': '7-Day Trend',
  'dashboard.thirtyDaysTab': '30-Day Analysis',

  'rings.title': 'Daily Activity Rings',
  'rings.steps': 'Steps',
  'rings.stepsUnit': 'steps',
  'rings.calories': 'Active Calories',
  'rings.caloriesUnit': 'kcal',
  'rings.intensity': 'Exercise Minutes',
  'rings.intensityUnit': 'min',
  'rings.goalAchieved': 'Goal Achieved',

  'sleep.title': 'Sleep Architecture',
  'sleep.score': 'Sleep Score',
  'sleep.totalDuration': 'Total Duration',
  'sleep.hours': '{h}h {m}m',
  'sleep.deep': 'Deep',
  'sleep.light': 'Light',
  'sleep.rem': 'REM',
  'sleep.awake': 'Awake',
  'sleep.bedtime': 'Bedtime',
  'sleep.wakeTime': 'Wake up',
  'sleep.avgHr': 'Sleep Avg HR',
  'sleep.avgSpo2': 'Sleep Avg SpO2',
  'sleep.nap': 'Nap',

  'heartRate.title': 'Heart Rate & Cardio',
  'heartRate.latest': 'Latest Heart Rate',
  'heartRate.bpm': 'BPM',
  'heartRate.resting': 'Resting HR',
  'heartRate.range': 'HR Range',
  'heartRate.min': 'Min',
  'heartRate.max': 'Max',
  'heartRate.zones': 'Heart Rate Zones',
  'heartRate.zoneWarmup': 'Warm Up',
  'heartRate.zoneFatBurn': 'Fat Burn',
  'heartRate.zoneAerobic': 'Aerobic',
  'heartRate.zoneAnaerobic': 'Anaerobic',
  'heartRate.zoneExtreme': 'Peak',

  'metrics.spo2': 'Blood Oxygen (SpO2)',
  'metrics.spo2Normal': 'Normal',
  'metrics.spo2Low': 'Attention Needed',
  'metrics.stand': 'Valid Standing',
  'metrics.standHours': '{count} hrs',
  'metrics.bloodPressure': 'Blood Pressure',
  'metrics.weight': 'Body Weight',
  'metrics.bmi': 'BMI',
  'metrics.bodyFat': 'Body Fat',

  'insights.title': 'AI Health Insights',
  'insights.scoreLabel': 'Holistic Health Index',
  'insights.healthy': 'Optimal Condition',
  'insights.attention': 'Attention Recommended',

  'loginModal.title': 'Connect Xiaomi Health (Mi Fitness)',
  'loginModal.step1': '1. Scan this QR code using the Mi Fitness or Xiaomi Account app:',
  'loginModal.step2': '2. Once authorized, the plugin will complete STS authentication.',
  'loginModal.browserLink': 'Or click here to authorize in your browser',
  'loginModal.waitingScan': 'Waiting for QR scan confirmation…',
  'loginModal.close': 'Close',
}

export const NS = 'dsh-xiaomi-health'

/** Namespace-bound translate function; params are interpolated into `{name}` slots. */
export type Translate = TranslateNS<typeof NS>
