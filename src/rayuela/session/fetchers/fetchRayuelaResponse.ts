import { redirectTarget } from '../../../http/redirectTarget'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { validateRayuelaUrl } from '../validators/validateRayuelaUrl'
/**
 * Rayuela pages default to Latin-1 even when no charset is declared.
 * Redirects are followed here, one hop at a time, so the session never
 * reaches a host outside Rayuela, not even another administration's.
 */
export const fetchRayuelaResponse = async (
  client: HttpClient,
  url: string,
  options: HttpRequestOptions = {},
): Promise<HttpResponse> => {
  let current = validateRayuelaUrl(url)
  let currentOptions: HttpRequestOptions = options
  for (let hop = 0; hop <= 10; hop += 1) {
    const response = await client.request(current, {
      ...currentOptions,
      defaultCharset: 'iso-8859-1',
      followRedirects: false,
    })
    const next = redirectTarget(response, current)
    if (next === undefined) {
      if (response.status !== 200)
        throw new Error(
          `Rayuela request failed (HTTP ${String(response.status)})`,
        )
      return response
    }
    current = validateRayuelaUrl(next)
    currentOptions = { headers: options.headers, timeoutMs: options.timeoutMs }
  }
  throw new Error('Rayuela: too many redirects')
}
