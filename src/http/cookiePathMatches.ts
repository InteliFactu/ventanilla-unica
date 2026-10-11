/**
 * Whether a request path may carry a cookie scoped to `cookiePath` (RFC 6265
 * 5.1.4): the same path, or one below it on a `/` boundary. The DGT's gateway
 * rejects a request "by policy" when it carries the `Path=/es` session
 * cookies on `/system/...`, which a browser never sends there.
 */
export const cookiePathMatches = (
  requestPath: string,
  cookiePath: string,
): boolean => {
  if (requestPath === cookiePath) return true
  if (!requestPath.startsWith(cookiePath)) return false
  return cookiePath.endsWith('/') || requestPath[cookiePath.length] === '/'
}
