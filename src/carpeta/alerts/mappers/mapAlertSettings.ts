import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import type { AlertSettings } from '../types/AlertSettings'
import { mapAlertGroup } from './mapAlertGroup'

/**
 * Map `configuracionAvisos` v2: `preferenciasUsuario` carries the email
 * (`prefEmail`, `prefEmailVerif` once confirmed) and groups of alerts, each
 * with `listaEventos`; a group counts as active when it mails or pushes.
 */
export const mapAlertSettings = (body: unknown): AlertSettings => {
  const prefs = asRecord(asRecord(body)?.['preferenciasUsuario'])
  if (!prefs)
    throw new Error(
      'Carpeta: configuracionAvisos carried no preferenciasUsuario',
    )
  const groups = (
    Array.isArray(prefs['preferencias']) ? prefs['preferencias'] : []
  ).map((entry) => mapAlertGroup(entry))
  return {
    email: readTextOrNull(prefs['prefEmail']),
    verifiedEmail: readTextOrNull(prefs['prefEmailVerif']),
    emailState: readTextOrNull(prefs['estadoPrefEmail']),
    activeAlerts: groups
      .filter((group) => group.email || group.push)
      .map((group) => group.name),
    groups,
  }
}
