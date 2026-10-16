import { htmlToText } from '../../../html/htmlToText'
import { readAttribute } from '../../../html/readAttribute'
import type { NotaCompany } from '../types/NotaCompany'

/**
 * The rows of the mercantil search result: a `selectedDocumentId` radio and
 * the cells sociedad, NIF, IRUS, registro and estado, in that order.
 */
export const readCompanyRows = (html: string): NotaCompany[] =>
  [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap((match) => {
    const row = match[1] ?? ''
    const input = /<input\s[^>]*name="selectedDocumentId"[^>]*>/i.exec(row)
    const documentId = input ? readAttribute(input[0], 'value') : undefined
    if (!documentId) return []
    const [name = '', nif = '', irus = '', registry = '', status = ''] = row
      .split(/<td\b/i)
      .slice(1)
      .map((cell) => htmlToText(`<td${cell}`))
    return [{ documentId, name, nif, irus, registry, status }]
  })
