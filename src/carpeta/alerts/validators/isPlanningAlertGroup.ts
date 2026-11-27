import { asRecord } from '../../../dehu/api/asRecord'
import { readAlertInteger } from '../parsers/readAlertInteger'

/** A whole-calendar plan must know every group's channel flags and notice days. */
export const isPlanningAlertGroup = (entry: unknown): boolean => {
  const group = asRecord(entry)
  if (!group) return false
  const level = readAlertInteger(group['nivelAgrupacion'])
  return (
    level !== null &&
    level > 0 &&
    typeof group['prefEnvioMail'] === 'boolean' &&
    typeof group['prefPush'] === 'boolean' &&
    (group['primerAviso'] === null ||
      readAlertInteger(group['primerAviso']) !== null) &&
    (group['segundoAviso'] === null ||
      readAlertInteger(group['segundoAviso']) !== null)
  )
}
