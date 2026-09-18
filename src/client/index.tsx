/**
 * dsh-xiaomi-health — Client plugin entry for DeepSeek Harness Web client.
 *
 * Mounts the health Remote namespace, registers i18n dictionaries, and
 * injects the conversation.view slot for the Xiaomi Health Dashboard.
 */
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

  // Register the health tab into the session conversation view ring.
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
