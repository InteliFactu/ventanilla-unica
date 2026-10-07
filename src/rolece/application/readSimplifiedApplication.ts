import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRegistrationCheck } from '../fetchers/fetchRegistrationCheck'
import { fetchSimplifiedForm } from '../fetchers/fetchSimplifiedForm'
import { mapSimplifiedApplicationFields } from '../mappers/mapSimplifiedApplicationFields'
import { readApplicationForm } from '../parsers/readApplicationForm'
import { readRegistrationCheck } from '../parsers/readRegistrationCheck'
import { requireOption } from '../selectors/requireOption'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import type { SimplifiedApplicationFields } from '../types/SimplifiedApplicationFields'
import { assertSimplifiedForm } from '../validators/assertSimplifiedForm'

/**
 * Walk the two read-only screens of an initial legal-entity application and
 * answer the exact body "Firmar y Enviar Solicitud" would post, with the
 * labels the portal showed for the comunidad and the province.
 */
export const readSimplifiedApplication = async (
  client: HttpClient,
  query: RegistrationQuery,
): Promise<SimplifiedApplicationFields> => {
  const first = await fetchRegistrationCheck(client, query.nif)
  const check = readRegistrationCheck(first, query.nif)
  if (check.pendingApplication)
    throw new Error(
      `ROLECE: an application for ${query.nif} is already pending (waiting for the nota registral); nothing was sent`,
    )
  if (check.inscribed || !check.initialApplication)
    throw new Error(
      `ROLECE: ${query.nif} is already inscribed; a modification application is not captured`,
    )
  const comunidad = requireOption(first.text, 'tipoComunidad', query.comunidad)
  const second = await fetchSimplifiedForm(client, query.nif, comunidad.value)
  const form = readApplicationForm(second)
  assertSimplifiedForm(form, query.nif, comunidad.value)
  const provincia = requireOption(
    second.text,
    'provinciaSimpli',
    query.provincia,
  )
  return {
    action: form.action,
    fields: mapSimplifiedApplicationFields(form, query, provincia.value),
  }
}
