import { readSuccessfulAlertPreferences } from '../parsers/readSuccessfulAlertPreferences'
import { isPlanningAlertGroup } from './isPlanningAlertGroup'

/** The front requires a successful settings response before building the save form. */
export const validateAlertSnapshot = (body: unknown): void => {
  const groups = readSuccessfulAlertPreferences(body)['preferencias']
  if (
    !Array.isArray(groups) ||
    groups.length === 0 ||
    !groups.every(isPlanningAlertGroup)
  )
    throw new Error('Carpeta: the alert group settings are incomplete')
}
