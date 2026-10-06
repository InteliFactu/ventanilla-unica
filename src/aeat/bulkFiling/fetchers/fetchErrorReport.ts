import type { HttpClient } from '../../../http/types/HttpClient'
import { bulkFilingUrls } from '../bulkFilingUrls'

/** "Descargar mensajes de error": every failing record with its messages, as text. */
export const fetchErrorReport = async (
  client: HttpClient,
  idEnvio: string,
): Promise<string> => {
  const response = await client.request(bulkFilingUrls.errors, {
    method: 'POST',
    referer: bulkFilingUrls.page,
    form: { idenvio: idEnvio, codificacion: 'UTF-8' },
  })
  return response.text
}
