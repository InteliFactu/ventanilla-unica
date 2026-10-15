import { regUrls } from '../regUrls'

/**
 * The headers of every API call. The API answers 400 to any
 * `Accept-Language` with more than one tag (`es-ES,es;q=0.9`, the client's
 * default), so one tag is sent.
 */
export const buildRegHeaders = (
  token: string | undefined,
  contentType: string | undefined,
): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': 'es-ES',
    Origin: regUrls.origin,
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (contentType !== undefined) headers['Content-Type'] = contentType
  return headers
}
