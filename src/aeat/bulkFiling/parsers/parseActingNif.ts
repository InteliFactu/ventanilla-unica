/**
 * The NIF the session acts for. The user menu lists the certificate holder's
 * NIF, then the represented NIF, which is blank when acting in one's own name.
 */
export const parseActingNif = (html: string): string | undefined => {
  const nifs = [
    ...html.matchAll(/<small class="d-block text-secondary">([^<]*)<\/small>/g),
  ].map((match) => (match[1] ?? '').trim())
  const [holder, represented] = nifs
  return represented || holder || undefined
}
