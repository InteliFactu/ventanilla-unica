import type { StaNotificationScope } from '../types/StaNotificationScope'

/**
 * Role and tab of a notification dataset from its name:
 * `NOTIFICACIONES_ACEPTADA` or `NOTIFICACIONES_REP_PENDIENTE`. Undefined for
 * any other dataset.
 */
export const notificationScope = (
  name: string,
): StaNotificationScope | undefined => {
  const match = /^NOTIFICACIONES_(REP_)?([A-Z]+)$/.exec(name)
  if (!match?.[2]) return undefined
  return {
    role: match[1] ? 'representante' : 'interesado',
    tab: match[2].toLowerCase(),
  }
}
