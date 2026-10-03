import type { HttpClient } from '../../../http/types/HttpClient'

/**
 * Headers of every API call. The SPA sends the `__csrf` cookie back as
 * `X-CSRF-TOKEN` (axios `withSecurity`); without it writes are refused.
 */
export const registryHeaders = (
  client: HttpClient,
  origin: string,
): Record<string, string> => {
  const token = client.cookie(new URL(origin).hostname, '__csrf')
  return {
    Accept: 'application/json, text/plain, */*',
    ...(token ? { 'X-CSRF-TOKEN': token } : {}),
  }
}
