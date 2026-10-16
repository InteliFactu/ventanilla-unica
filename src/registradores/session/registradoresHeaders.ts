/**
 * Sent on every request to the sede: no socket is kept alive. The F5 in front
 * of `api-sede-pub-auth` drops idle kept-alive sockets right after its 302s
 * (live 2026-10-16: the hop to `saml2/authenticate/f5` and the SAMLResponse
 * POST, every run), and the next request on such a socket dies with
 * ECONNRESET. A POST must not be replayed, so the socket is never reused.
 */
export const registradoresHeaders: Readonly<Record<string, string>> = {
  Connection: 'close',
}
