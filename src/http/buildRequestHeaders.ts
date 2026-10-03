import { browserUserAgent } from './browserUserAgent'
import type { CookieJar } from './CookieJar'
import type { HttpRequestOptions } from './types/HttpRequestOptions'

/** The headers one request sends: a browser's defaults, the jar's cookies, the referer and the body framing. */
export const buildRequestHeaders = (
  target: URL,
  jar: CookieJar,
  options: HttpRequestOptions,
  body: string | Buffer | undefined,
): Record<string, string> => {
  const headers: Record<string, string> = {
    'User-Agent': browserUserAgent,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9',
    ...options.headers,
  }
  const cookie = jar.headerFor(target.hostname)
  if (cookie) headers['Cookie'] = cookie
  if (options.referer) headers['Referer'] = options.referer
  if (body !== undefined) {
    headers['Content-Type'] ??= 'application/x-www-form-urlencoded'
    headers['Content-Length'] = String(Buffer.byteLength(body))
  }
  return headers
}
