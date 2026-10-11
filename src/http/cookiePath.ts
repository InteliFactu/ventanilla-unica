/**
 * The explicit `Path` attribute of a `Set-Cookie` header, or `/` when there
 * is none. The default-path rule (the directory of the request URL) is
 * deliberately not applied: before paths were honoured at all, every cookie
 * reached every path, and only an explicit attribute is worth narrowing.
 */
export const cookiePath = (attributes: readonly string[]): string => {
  const path = attributes
    .map((attribute) => attribute.trim())
    .find((attribute) => attribute.toLowerCase().startsWith('path='))
    ?.slice('path='.length)
    .trim()
  return path?.startsWith('/') === true ? path : '/'
}
