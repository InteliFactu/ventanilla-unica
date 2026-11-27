import { unescapeHtml } from '../../../html/unescapeHtml'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

export const selectYouthGuaranteeDocumentUrl = (
  href: string,
  label: string,
): string | undefined => {
  if (!/certificad|justificante/i.test(label)) return undefined
  try {
    const url = new URL(unescapeHtml(href), youthGuaranteeUrls.origin)
    return url.origin === youthGuaranteeUrls.origin &&
      !url.username &&
      !url.password &&
      /\.pdf$|descargar|download/i.test(url.pathname)
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}
