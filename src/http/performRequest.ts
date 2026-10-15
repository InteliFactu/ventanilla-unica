import { once } from 'node:events'
import type { IncomingMessage } from 'node:http'
import { request as httpsRequest } from 'node:https'

import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { buildRequestHeaders } from './buildRequestHeaders'
import { collectResponse } from './collectResponse'
import type { CookieJar } from './CookieJar'
import { trustedCertificateAuthorities } from './trustedCertificateAuthorities'
import type { HttpRequestOptions } from './types/HttpRequestOptions'
import type { HttpResponse } from './types/HttpResponse'

/** One HTTPS exchange with the client certificate offered to the host; redirects are the caller's. */
export const performRequest = async (
  url: string,
  identity: CertificateIdentity | undefined,
  jar: CookieJar,
  options: HttpRequestOptions,
): Promise<HttpResponse> => {
  const defaultTimeoutMs = 60_000
  const target = new URL(url)
  const body = options.form
    ? new URLSearchParams(options.form).toString()
    : options.body
  const method = options.method ?? (body === undefined ? 'GET' : 'POST')
  const req = httpsRequest({
    hostname: target.hostname,
    port: target.port === '' ? undefined : Number(target.port),
    path: target.pathname + target.search,
    method,
    ...(identity === undefined
      ? {}
      : {
          cert: identity.cert,
          key: identity.key,
          passphrase: identity.passphrase,
        }),
    ca: [...trustedCertificateAuthorities],
    headers: buildRequestHeaders(target, jar, options, body),
    timeout: options.timeoutMs ?? defaultTimeoutMs,
  })
  req.on('timeout', () => {
    req.destroy(new Error(`timeout: ${url}`))
  })
  if (body !== undefined) req.write(body)
  req.end()
  const [res] = (await once(req, 'response')) as [IncomingMessage]
  return collectResponse(res, url, jar, options.defaultCharset)
}
