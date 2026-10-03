import type { HttpResponse } from '../../http/types/HttpResponse'
import type { RegistrationCheck } from '../types/RegistrationCheck'
import { readApplicationForm } from './readApplicationForm'

/**
 * Read the answer to `comprobarOEInscrito`. The screen echoes the identifier
 * in `numDocumento`; a different one means the portal answered about someone
 * else (a stale session), and the check refuses rather than guess.
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
  }
}
