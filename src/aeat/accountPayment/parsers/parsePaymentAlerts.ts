import { htmlToText } from '../../../html/htmlToText'

/**
 * The messages of the "Errores detectados" block (`#idDivAlertas`), one per
 * `<li>`, without the trailing "(Ir a error)" link.
 */
export const parsePaymentAlerts = (html: string): readonly string[] => {
  const start = html.indexOf('id="idDivAlertas"')
  if (start < 0) return []
  const end = html.indexOf('</div>', start)
  const block = html.slice(start, end < 0 ? undefined : end)
  return [...block.matchAll(/<li\b[^>]*>([\s\S]*?)(?=<li\b|<\/li>|$)/gi)]
    .map(([, item = '']) =>
      htmlToText(item)
        .replace(/\(\s*Ir a error\s*\)$/i, '')
        .trim(),
    )
    .filter((text) => text.length > 0)
}
