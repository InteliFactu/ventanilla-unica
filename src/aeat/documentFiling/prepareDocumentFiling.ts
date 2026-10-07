import type { HttpClient } from '../../http/types/HttpClient'
import { fetchFilingForm } from './fetchers/fetchFilingForm'
import { parseFilingForm } from './parsers/parseFilingForm'
import type { DocumentFilingQuery } from './types/DocumentFilingQuery'
import type { PreparedDocumentFiling } from './types/PreparedDocumentFiling'
import { readFilingDocuments } from './validators/readFilingDocuments'

/**
 * The read-only half: read the PDFs and open the form the CSV resolves to.
 * The registry decides there whether the holder may file: as interesado only
 * on their own documents, as representative only with a power on record.
 */
export const prepareDocumentFiling = async (
  client: HttpClient,
  query: DocumentFilingQuery,
): Promise<PreparedDocumentFiling> => {
  const documents = await readFilingDocuments(query.files)
  const form = parseFilingForm(
    await fetchFilingForm(client, query.csv, query.role),
  )
  if (query.role === 'R' && form.representante === undefined)
    throw new Error(
      'AEAT: the registry opened the form without a representative; nothing is filed',
    )
  return { form, documents }
}
