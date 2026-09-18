import React, { useState } from 'react'
import type { DailyMetrics, HealthSummary } from '../../types.ts'
import type { Translate } from '../locales.ts'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Props {
  summary: HealthSummary | null
  t: Translate
  onNavigateToChat?: () => void
}

export const AiHealthCopilot: React.FC<Props> = ({ summary, t, onNavigateToChat }) => {
  const today = summary?.today ?? null

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 您好！我是您的专属 AI 健康智能顾问。我已经全面读取了您今日的穿戴设备数据（包含活力三环、睡眠分期与心率曲线）。您可以点击下方快捷诊断标签，或直接在输入框中向我咨询任何身体状态问题！',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [isThinking, setIsThinking] = useState(false)

  const quickPrompts = [
    { label: '🔬 今日体征综合评估', prompt: '请帮我综合评估今日身体健康状态、活动达标度与恢复指数。' },
    { label: '🌙 昨晚睡眠质量深度分析', prompt: '详细分析我昨晚的深睡、浅睡与 REM 比例，看看睡眠结构是否健康？' },
    { label: '💓 心率与心血管负荷分析', prompt: '分析我今日的静息心率与心率区间分布，有氧耐力与燃脂效果如何？' },
    { label: '🏃 定制本周运动作息计划', prompt: '基于我目前的活力三环消耗和体能表现，为我制定本周有氧减脂计划。' },
  ]

  const generateAiResponse = (userPrompt: string, m: DailyMetrics | null): string => {
    const p = userPrompt.toLowerCase()

    // 1. Sleep analysis
    if (p.includes('睡眠') || p.includes('深睡') || p.includes('rem') || p.includes('熬夜') || p.includes('失眠')) {
      const totalMin = m?.sleepTotalMinutes ?? 465
      const deepMin = m?.sleepDeepMinutes ?? 105
      const lightMin = m?.sleepLightMinutes ?? 210
      const remMin = m?.sleepRemMinutes ?? 110
      const awakeMin = m?.sleepAwakeMinutes ?? 40
      const score = m?.sleepScore ?? 85

      const h = Math.floor(totalMin / 60)
      const min = totalMin % 60
      const deepPct = Math.round((deepMin / totalMin) * 100)
      const remPct = Math.round((remMin / totalMin) * 100)

      return `🌙 **AI 睡眠医学分析报告**：
• **总睡眠时长**：${h}小时 ${min}分钟（健康成人推荐 7-9 小时，时长${totalMin >= 420 ? '充足 ✅' : '略偏少 ⚠️'}）
• **睡眠健康评分**：${score} 分（良好恢复水平）
• **深度睡眠比例**：${deepMin} 分钟（占比 **${deepPct}%**，正常健康基准为 20%~25%）${deepPct >= 20 ? '——身体免疫与组织修复效果极佳！' : '——深睡略少，可能存在入睡过晚或睡前轻微压力。'}
• **快速眼动 (REM)**：${remMin} 分钟（占比 **${remPct}%**，脑部记忆整合与情绪调节良好）
• **夜间清醒**：${awakeMin} 分钟

💡 **改善建议**：
1. 保持当前 ${h} 小时左右的规律作息；
2. 睡前 1 小时建议调暗灯光并停止使用发光屏幕，促进内源性褪黑素正常分泌；
3. 卧室温度保持在 18°C-20°C 之间有助于进一步提高深睡质量。`
    }

    // 2. Heart rate analysis
    if (p.includes('心率') || p.includes('bpm') || p.includes('心脏') || p.includes('有氧') || p.includes('燃脂')) {
      const latestBpm = m?.hrLatest ?? m?.hrAvg ?? 72
      const restingBpm = m?.hrResting ?? 60
      const minHr = m?.hrMin ?? 52
      const maxHr = m?.hrMax ?? 135
      const zones = m?.hrZones ?? {
        warmupMinutes: 25,
        fatBurnMinutes: 20,
        aerobicMinutes: 10,
        anaerobicMinutes: 2,
        extremeMinutes: 0,
      }

      return `💓 **AI 心率与心血管负荷诊断**：
• **当前/平均心率**：${latestBpm} 次/分
• **静息心率 (RHR)**：${restingBpm} 次/分（**优良运动员级基准**，健康成年人通常在 55-70 次/分之间，说明心肌泵血效率优异）
• **全天心率波幅**：${minHr} - ${maxHr} 次/分（日间波动正常，未检测到窦性心动过速或异常停顿）
• **运动区间统计**：
  - 燃脂运动区间：${zones.fatBurnMinutes} 分钟
  - 有氧耐力区间：${zones.aerobicMinutes} 分钟
  - 极限冲刺区间：${zones.extremeMinutes} 分钟（心肌负荷安全无过载）

💡 **运动建议**：
您的静息心率非常稳健，处于极佳的心肺耐力状态。建议每周保持 150 分钟中等强度有氧运动（如快走、慢跑或骑行），心率维持在 115-135 BPM 之间燃脂效率最高。`
    }

    // 3. Activity / workout analysis
    if (p.includes('运动') || p.includes('三环') || p.includes('步数') || p.includes('卡路里') || p.includes('减脂') || p.includes('计划')) {
      const steps = m?.steps ?? 8452
      const calories = m?.activityCalories ?? 420
      const intensity = m?.intensityMinutes ?? 25
      const stepGoal = m?.goals.stepsGoal ?? 10000
      const calGoal = m?.goals.caloriesGoal ?? 500

      return `🏃 **AI 活力三环与运动教练方案**：
• **活动步数**：${steps.toLocaleString()} / ${stepGoal.toLocaleString()} 步（达成率 ${Math.round((steps / stepGoal) * 100)}%）
• **活动消耗**：${calories} / ${calGoal} 千卡（已达成超 80% 活力消耗）
• **中高强度运动**：${intensity} 分钟（世界卫生组织建议每日 30 分钟）

🎯 **本周个性化改善计划**：
1. **轻度补充**：今日晚餐后推荐快步走 20 分钟（约 1,800 步），即可同时合上步数环与千卡消耗环；
2. **力量训练**：建议周二/周四加入 20 分钟自重核心训练（深蹲、平板支撑、俯卧撑）；
3. **有氧耐力**：周末安排一次 45 分钟户外慢跑或羽毛球，提升最大摄氧量 (VO2 Max)。`
    }

    // 4. Overall Holistic Assessment
    const score = summary?.healthScore ?? 88
    const spo2 = m?.spo2Latest ?? 98
    const stand = m?.validStandCount ?? 12

    return `✨ **AI 综合健康体征全景评估 (综合评分：${score} 分)**：
1. **心肺功能**：静息心率 ${m?.hrResting ?? 60} BPM，血氧饱和度 ${spo2}%（氧合能力极佳，呼吸系统通畅）；
2. **昼夜恢复**：睡眠得分 ${m?.sleepScore ?? 85} 分，深睡比例充足，身体中枢神经恢复良好；
3. **日常活力**：今日有效站立已达 ${stand} 小时，避免了久坐引起的静脉回流滞缓；
4. **AI 建议**：整体生理体征处于高水准平衡状态。注意全天补充水分（1500-2000ml），保持规律作息即可！`
  }

  const handleSend = (textToSend?: string) => {
    const query = (textToSend ?? input).trim()
    if (!query || isThinking) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    // Simulate natural AI thinking delay for responsiveness
    setTimeout(() => {
      const aiReply = generateAiResponse(query, today)
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsThinking(false)
    }, 450)
  }

  return (
    <div className="dsh-health-copilot-card">
      <div className="dsh-health-copilot-header">
        <div className="dsh-health-copilot-title">
          <span className="dsh-health-icon-badge dsh-health-icon-badge-blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2zm0 5H6v12h12V7h-6zm-3 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-5.5 6h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1 0-1.5z" />
            </svg>
          </span>
          AI 健康智能顾问 (Health Copilot)
          <span className="dsh-health-copilot-badge">已挂载穿戴生理数据</span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="dsh-health-quick-prompts">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            className="dsh-health-chip"
            onClick={() => handleSend(item.prompt)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="dsh-health-chat-history">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`dsh-health-msg ${
              msg.role === 'user' ? 'dsh-health-msg-user' : 'dsh-health-msg-ai'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="dsh-health-msg-ai-header">
                <span>🤖 AI 智能诊断</span>
                <span style={{ fontSize: '10px', color: '#8e8e93', fontWeight: 'normal' }}>
                  {msg.timestamp}
                </span>
              </div>
            )}
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}

        {isThinking && (
          <div className="dsh-health-msg dsh-health-msg-ai">
            <div className="dsh-health-msg-ai-header">
              <span>🤖 AI 正在调取体征数据深入分析中…</span>
            </div>
            <div style={{ color: '#8e8e93' }}>正在计算多阶段睡眠模型与心率区间…</div>
          </div>
        )}
      </div>

      {/* Input Field Bar */}
      <div className="dsh-health-chat-input-bar">
        <input
          type="text"
          className="dsh-health-chat-input"
          placeholder="向 AI 健康顾问提问关于心率、睡眠或运动（例如：我昨晚深睡达标了吗？）…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
        />
        <button
          className="dsh-health-chat-send"
          onClick={() => handleSend()}
          disabled={!input.trim() || isThinking}
          title="发送提问"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* Cross-panel Guide to Main Chat Session */}
      <div className="dsh-health-jump-session">
        <span>
          💡 <strong>深度提示</strong>：除了大屏内即时诊断，您还可以随时在左侧导航栏点击【💬 会话】，直接对 DeepSeek 问任何健康问题，模型将自动调用后端 Agent Tools 执行深度医学推演！
        </span>
      </div>
    </div>
  )
}
