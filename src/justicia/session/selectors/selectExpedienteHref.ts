import { unescapeHtml } from '../../../html/unescapeHtml'

/** The detail link of the expediente card with the given list index (`idExpediente`). */
export const selectExpedienteHref = (
  html: string,
  index: number,
): string | undefined => {
  const href = [...html.matchAll(/<a class="cj-card[^"]*" href="([^"]+)"/g)]
    .map((match) => unescapeHtml(match[1] ?? ''))
    .find((link) => link.includes(`_idExpediente=${String(index)}&`))
  return href
}
