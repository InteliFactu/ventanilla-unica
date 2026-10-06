import type { HttpClient } from '../../../http/types/HttpClient'
import { bulkFilingUrls } from '../bulkFilingUrls'
import { parseSignatureDialog } from '../parsers/parseSignatureDialog'
import type { BulkSignatureDialog } from '../types/BulkSignatureDialog'

/** The "Firmar y Enviar" window of a validated envío; opening it signs nothing. */
export const fetchSignatureDialog = async (
  client: HttpClient,
  idEnvio: string,
): Promise<BulkSignatureDialog> => {
  const response = await client.request(
    `${bulkFilingUrls.signatureDialog}?IDENVIO=${encodeURIComponent(idEnvio)}`,
    { referer: bulkFilingUrls.page, defaultCharset: 'iso-8859-15' },
  )
  return parseSignatureDialog(response.text)
}
