import { isIP } from 'node:net'

import { internalAddresses } from '../internalAddresses'

/**
 * Refuse a TSA URL that is not http(s) or that names this machine or a
 * private network: a `tsaURL` comes from a sede page, and the query must not
 * become a request into the holder's own network. shortcut: a public name
 * that resolves to a private address (DNS rebinding) is not caught; resolve
 * and pin the address if that ever matters.
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
      : internalAddresses.check(host, family === 4 ? 'ipv4' : 'ipv6')
  if (internal) throw new Error(`refused TSA on an internal host: ${hostname}`)
}
