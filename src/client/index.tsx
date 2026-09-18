/**
 * dsh-xiaomi-health — Client plugin entry for DeepSeek Harness Web client.
 *
 * Mounts the health Remote namespace, registers i18n dictionaries, and
 * registers:
 * 1. `sidebar.panellist` + `main`: Global left navigation panel for Apple Health Dashboard.
 * 2. `conversation.view`: In-conversation secondary tab.
 */
import React from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { DSH_HEALTH_REMOTE } from './remote.ts'
import { NS, en, zh } from './locales.ts'
import {
  HealthView,
  type HealthActions,
  type HealthViewSlotProps,
} from './view.tsx'
import { adoptStyles } from './styles.ts'

export const inject = ['slots', 'remote', 'locale']

const PANEL_ID = 'dsh-xiaomi-health' as any

function HealthPanelIcon({
  size = 16,
  active,
}: {
  size?: number
  active?: boolean
}): React.ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? '#ff2d55' : 'none'}
      stroke={active ? '#ff2d55' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', transition: 'all 0.15s ease' }}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

export function apply(ctx: ClientContext): void {
  adoptStyles()
  ctx.effect(
    () => ctx.locale.register(NS, { zh, en }),
    'dsh-xiaomi-health: dictionaries',
  )

  let health: unknown
  const t = ctx.locale.bind(NS)

  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(DSH_HEALTH_REMOTE)
    health = (ctx.reflect as unknown as { get(name: string): unknown }).get(
      'remote.health',
    )
    if (health === undefined) {
      throw new Error(
        'dsh-xiaomi-health: the health Remote namespace did not mount',
      )
    }
    return () => {
      health = undefined
      void dispose()
    }
  }, 'dsh-xiaomi-health: remote')

  const actions: HealthActions = {
    getStatus: () => {
      if (!health) {
        return Promise.reject(new Error('health Remote is not mounted'))
      }
      return (health as any).getStatus()
    },
    getSummary: () => {
      if (!health) {
        return Promise.reject(new Error('health Remote is not mounted'))
      }
      return (health as any).getSummary()
    },
    getDailyMetrics: (days: number) => {
      if (!health) {
        return Promise.reject(new Error('health Remote is not mounted'))
      }
      return (health as any).getDailyMetrics(days)
    },
    syncNow: (days: number) => {
      if (!health) {
        return Promise.reject(new Error('health Remote is not mounted'))
      }
      return (health as any).syncNow(days)
    },
    generateMockData: (days: number) => {
      if (!health) {
        return Promise.reject(new Error('health Remote is not mounted'))
      }
      return (health as any).generateMockData(days)
    },
    startLogin: () => {
      if (!health) {
        return Promise.reject(new Error('health Remote is not mounted'))
      }
      return (health as any).startLogin()
    },
  }

  // 1. Register into Global Left Sidebar panel list
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 15,
        label: () => t('dashboard.navTitle'),
        locale: NS,
      },
      HealthPanelIcon,
    ),
  )

  // 2. Register into Main panel for full-screen Apple Health dashboard
  ctx.slots.inject('main', () =>
    ctx.slots.register(
      {
        name: 'main',
        key: PANEL_ID,
        locale: NS,
      },
      () => (
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            background: '#000000',
            boxSizing: 'border-box',
          }}
        >
          <HealthView actions={actions} t={t} />
        </div>
      ),
    ),
  )

  // 3. Register as secondary session conversation view tab
  ctx.slots.inject('conversation.view', () =>
    ctx.slots.register(
      {
        name: 'conversation.view',
        id: 'dsh-xiaomi-health',
        order: 25,
        label: () => t('dashboard.title'),
        inject: () => ({ actions, t }),
      },
      (props: HealthViewSlotProps) => (
        <HealthView actions={props.actions} t={props.t} />
      ),
    ),
  )
}
