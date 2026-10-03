import { parseForms } from '../../html/parsers/parseForms'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { placspUrls } from '../session/placspUrls'

/**
 * Press "COMPROBAR DISPONIBILIDAD" on the self-registration page: a JSF
 * post of the form with its ViewState and only that button, which checks
 * whether a user id and an e-mail are already registered. It creates
 * nothing; "ACEPTAR" (with a captcha and a password) is what registers.
 * The password fields go empty and the other buttons are not posted, as in
 * a browser.
 */
export const fetchAvailabilityCheck = async (
  client: HttpClient,
  email: string,
  userId: string,
): Promise<HttpResponse> => {
  const page = await client.request(placspUrls.registration)
  const form = parseForms(page.text, page.url).find((candidate) =>
    candidate.action.includes('/wps/portal/registrarse'),
  )
  const prefix = Object.keys(form?.fields ?? {})
    .find((name) => name.endsWith(':idUsu'))
    ?.slice(0, -':idUsu'.length)
  if (!form || prefix === undefined)
    throw new Error(`PLACSP: no registration form at ${page.url}`)
  const served = Object.entries(form.fields).filter(
    ([name]) => !name.includes(':button') && !name.endsWith('Real'),
  )
  return client.request(form.action, {
    method: 'POST',
    referer: page.url,
    form: {
      ...Object.fromEntries(served),
      [`${prefix}:idUsu`]: userId,
      [`${prefix}:idEmail`]: email,
      [`${prefix}:buttonComprobarDisponibilidad`]: 'COMPROBAR DISPONIBILIDAD',
    },
  })
}
