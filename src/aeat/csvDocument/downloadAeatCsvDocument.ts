import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { fetchCsvDocument } from './fetchers/fetchCsvDocument'
import { saveCsvDocument } from './saveCsvDocument'
import type { AeatCsvDocument } from './types/AeatCsvDocument'
import type { AeatCsvDocumentQuery } from './types/AeatCsvDocumentQuery'

/**
 * `aeat cotejo`: fetch the document behind an AEAT CSV (a notification, a
 * diligencia de embargo, a resolution) and save it. Read-only: verifying a CSV
 * opens no notification and starts no deadline.
 */
export const downloadAeatCsvDocument = async (
  client: HttpClient,
  query: AeatCsvDocumentQuery,
): Promise<AeatCsvDocument> => {
  await openAeatSession(client)
  const pdf = await fetchCsvDocument(client, query.csv, query.nif)
  const path = await saveCsvDocument(query.out, query.csv, pdf)
  return { csv: query.csv, path, bytes: pdf.length }
}
