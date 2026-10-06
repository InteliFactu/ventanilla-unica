import type { HttpClient } from '../../../http/types/HttpClient'
import { bulkFilingUrls } from '../bulkFilingUrls'

/** TGVI Online for one model and year; a holder the AEAT will not let file answers 403. */
export const fetchTgviPage = async (
  client: HttpClient,
  modelo: string,
  ejercicio: string,
): Promise<string> => {
  const response = await client.request(
    `${bulkFilingUrls.page}?modelo=${modelo}&ejercicio=${ejercicio}`,
    { defaultCharset: 'iso-8859-15' },
  )
  if (response.status !== 200)
    throw new Error(
      `TGVI: the page answered HTTP ${String(response.status)}; the certificate may not file for this holder`,
    )
  return response.text
}
