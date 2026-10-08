/**
 * The per-session token the form asks @firma to sign, kept in a hidden
 * `<textarea id="unsignedData">`; the server checks the CAdES carries it.
 */
export const readUnsignedToken = (html: string): string => {
  const match = /id="unsignedData"[^>]*>\s*([^<\s]+)\s*</.exec(html)
  if (!match?.[1]) throw new Error('nic.es: no token to sign on the email form')
  return match[1]
}
