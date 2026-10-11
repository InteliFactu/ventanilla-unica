import { cookieScope } from './cookieScope'
import { isExpiredCookie } from './validators/isExpiredCookie'

/**
 * The smallest cookie jar the portals need. A cookie without a `Domain`
 * attribute belongs to the host that set it; with one, to that domain and its
 * subdomains, which is how the Cl@ve relay shares state between
 * `pasarela.clave.gob.es` and `pasarela-ident.clave.gob.es`. A cookie whose
 * domain is not the host or a parent of it, or is a public suffix, is dropped. Paths are
 * ignored and expiry only matters as deletion: a header whose `Expires` is past
 * or whose `Max-Age` is zero removes the cookie, as a browser would.
 */
export class CookieJar {
  private readonly cookies = new Map<string, Map<string, string>>()

  /** Store every `Set-Cookie` header of a response from that host. */
  store(host: string, setCookieHeaders: readonly string[]): void {
    for (const header of setCookieHeaders) {
      const [pair, ...attributes] = header.split(';')
      const separator = pair?.indexOf('=') ?? -1
      if (!pair || separator <= 0) continue
      const scope = cookieScope(host, attributes)
      if (scope === undefined) continue
      const bucket = this.cookies.get(scope) ?? new Map<string, string>()
      const name = pair.slice(0, separator).trim()
      if (isExpiredCookie(attributes)) bucket.delete(name)
      else bucket.set(name, pair.slice(separator + 1))
      this.cookies.set(scope, bucket)
    }
  }

  /** The `Cookie` request header for a host, or undefined when there is none. */
  headerFor(host: string): string | undefined {
    const pairs = [...this.cookiesFor(host)].map(
      ([name, value]) => `${name}=${value}`,
    )
    return pairs.length === 0 ? undefined : pairs.join('; ')
  }

  /** One cookie's value for a host, or undefined. */
  get(host: string, name: string): string | undefined {
    return this.cookiesFor(host).get(name)
  }

  private cookiesFor(host: string): Map<string, string> {
    const merged = new Map<string, string>()
    for (const [scope, bucket] of this.cookies) {
      if (host === scope || host.endsWith(`.${scope}`))
        for (const [name, value] of bucket) merged.set(name, value)
    }
    return merged
  }
}
