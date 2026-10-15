import { isIP } from 'node:net'

import { isInternalAddress } from './isInternalAddress'

/**
 * Refuse a TSA URL that is not http(s) or that names this machine or a
 * private network: a `tsaURL` comes from a sede page, and the query must not
 * become a request into the holder's own network. A public name that
 * resolves to a private address is refused at connect time by
 * `lookupPublicAddress`.
 */
export const validateTsaUrl = (url: string): void => {
  const { protocol, hostname } = new URL(url)
  if (protocol !== 'https:' && protocol !== 'http:')
    throw new Error(`a TSA URL is http or https: ${url}`)
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  const family = isIP(host)
  const internal =
    family === 0
      ? host === 'localhost' ||
        /\.(?:localhost|local|internal|lan|home\.arpa)$/.test(host) ||
        !host.includes('.')
      : isInternalAddress(host)
  if (internal) throw new Error(`refused TSA on an internal host: ${hostname}`)
}
