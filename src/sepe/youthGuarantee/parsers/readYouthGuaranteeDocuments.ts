import { htmlToText } from '../../../html/htmlToText'
import { readAttribute } from '../../../html/readAttribute'
import { selectYouthGuaranteeDocumentUrl } from '../selectors/selectYouthGuaranteeDocumentUrl'
import type { YouthGuaranteeDocument } from '../types/YouthGuaranteeDocument'

/** Expose offered downloads, never invent or invoke a certificate-generation action. */
export const readYouthGuaranteeDocuments = (
  html: string,
): readonly YouthGuaranteeDocument[] => {
  const documents: YouthGuaranteeDocument[] = []
  for (const [, tag = '', inner = ''] of html
    .replaceAll(/<!--[\s\S]*?-->/g, '')
    .matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = readAttribute(tag, 'href')
    const label = htmlToText(inner)
    const url = href ? selectYouthGuaranteeDocumentUrl(href, label) : undefined
    if (url && !documents.some((document) => document.url === url))
      documents.push({ label, url })
  }
  return documents
}
