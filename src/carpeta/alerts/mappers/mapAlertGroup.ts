import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import { readAlertInteger } from '../parsers/readAlertInteger'
import type { AlertGroup } from '../types/AlertGroup'

/** Expose the available settings for one group in the alert calendar. */
export const mapAlertGroup = (entry: unknown): AlertGroup => {
  const group = asRecord(entry) ?? {}
  return {
    level: readAlertInteger(group['nivelAgrupacion']) || null,
    name: readTextOrNull(group['nombreAgrupacion']) ?? '',
    email: group['prefEnvioMail'] === true,
    push: group['prefPush'] === true,
    firstNotice: readAlertInteger(group['primerAviso']),
    secondNotice: readAlertInteger(group['segundoAviso']),
  }
}
