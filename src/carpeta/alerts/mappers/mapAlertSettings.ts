import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import type { AlertSettings } from '../types/AlertSettings'

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
  const groups = Array.isArray(prefs['preferencias'])
    ? prefs['preferencias']
    : []
  const activeAlerts = groups
    .map((group) => asRecord(group))
    .filter(
      (group) =>
        group?.['prefEnvioMail'] === true || group?.['prefPush'] === true,
    )
    .map((group) => readTextOrNull(group?.['nombreAgrupacion']) ?? '')
  return {
    email: readTextOrNull(prefs['prefEmail']),
    verifiedEmail: readTextOrNull(prefs['prefEmailVerif']),
    emailState: readTextOrNull(prefs['estadoPrefEmail']),
    activeAlerts,
  }
}
