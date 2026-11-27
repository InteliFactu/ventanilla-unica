import type { AlertGroup } from '../types/AlertGroup'
import type { AlertPreference } from '../types/AlertPreference'
import type { NoticeDays } from '../types/NoticeDays'

/** Preserve a group's channels and days except for the requested email changes. */
export const mapAlertPreference = (
  group: AlertGroup,
  levels: readonly number[],
  days: NoticeDays,
): AlertPreference => {
  if (group.level === null)
    throw new Error('Carpeta: an alert group has no usable level')
  const selected = levels.includes(group.level)
  return {
    prefNivelAgrupacion: group.level,
    primerAviso: selected ? days.first : group.firstNotice,
    segundoAviso: selected ? days.second : group.secondNotice,
    prefPush: group.push,
    prefEnvioMail: selected || group.email,
  }
}
