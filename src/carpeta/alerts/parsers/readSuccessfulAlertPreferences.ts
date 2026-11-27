import { asRecord } from '../../../dehu/api/asRecord'

/** Require an explicit successful settings envelope before interpreting its fields. */
export const readSuccessfulAlertPreferences = (
  body: unknown,
): Record<string, unknown> => {
  const settings = asRecord(asRecord(body)?.['preferenciasUsuario'])
  const outcome = asRecord(settings?.['codigoRespuesta'])
  const code = outcome?.['codRespuesta']
  if (!settings || (code !== 0 && code !== '0'))
    throw new Error(
      'Carpeta: the alert settings response does not report success',
    )
  return settings
}
