import { htmlToText } from '../../html/htmlToText'
import type { HttpResponse } from '../../http/types/HttpResponse'
import type { RegistrationCheck } from '../types/RegistrationCheck'
import { readApplicationForm } from './readApplicationForm'

/**
 * Read the answer to `comprobarOEInscrito`. The screen echoes the identifier
 * in `numDocumento`; a different one means the portal answered about someone
 * else (a stale session), and the check refuses rather than guess. Once an application is filed the screen says "Ya
 * existe una solicitud para este operador económico pendiente de recibir los
 * datos del Registro Mercantil" instead of starting a new one.
 */
export const readRegistrationCheck = (
  page: HttpResponse,
  nif: string,
): RegistrationCheck => {
  const { fields } = readApplicationForm(page)
  if (fields['numDocumento'] !== nif)
    throw new Error(
      `ROLECE: the check answered for ${fields['numDocumento'] ?? 'no identifier'}, not ${nif}`,
    )
  return {
    nif,
    inscribed: fields['inscrito'] === 'true',
    initialApplication: fields['solicitudInicial'] === 'true',
    pendingApplication: /ya existe una solicitud para este operador/i.test(
      htmlToText(page.text),
    ),
  }
}
