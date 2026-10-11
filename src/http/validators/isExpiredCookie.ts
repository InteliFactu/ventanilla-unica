/**
 * True when a `Set-Cookie` header's attributes delete the cookie: `Max-Age`
 * zero or negative, or an `Expires` date already past. WebSphere Portal (the
 * Seguridad Social's Importass) clears `com.ibm.portal.SUA_WPReqURL` with
 * `Expires=Thu, 01-Dec-94`; keeping the stale value makes every `myportal`
 * page redirect to itself.
 */
export const isExpiredCookie = (
  attributes: readonly string[],
  now = Date.now(),
): boolean =>
  attributes.some((raw) => {
    const attribute = raw.trim()
    const lower = attribute.toLowerCase()
    if (lower.startsWith('max-age='))
      return Number(attribute.slice('max-age='.length)) <= 0
    if (!lower.startsWith('expires=')) return false
    const expires = Date.parse(attribute.slice('expires='.length))
    return !Number.isNaN(expires) && expires <= now
  })
