import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatCsvDocumentUrl } from '../aeatCsvDocumentUrl'

/** GET the PDF an AEAT CSV verifies; anything that is not a PDF (an unknown CSV answers an HTML page) fails. */
export const fetchCsvDocument = async (
  client: HttpClient,
  csv: string,
  nif: string,
): Promise<Buffer> => {
  const response = await client.request(aeatCsvDocumentUrl(csv, nif))
  if (response.body.subarray(0, 4).toString('latin1') !== '%PDF')
    throw new Error(
      `AEAT: CSV ${csv} returned no document (HTTP ${String(response.status)})`,
    )
  return response.body
}
