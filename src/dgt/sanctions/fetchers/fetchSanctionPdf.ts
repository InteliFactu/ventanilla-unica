import type { HttpClient } from '../../../http/types/HttpClient'
import { dgtUrls } from '../../session/dgtUrls'

/** The "Datos de Expediente" PDF of one fine (`ajaxCalls.jsp?numExpediente=<n>`), as base64. */
export const fetchSanctionPdf = async (
  client: HttpClient,
  expediente: string,
): Promise<string> => {
  const response = await client.request(
    `${dgtUrls.miDgtCounters}?numExpediente=${encodeURIComponent(expediente)}`,
    { referer: dgtUrls.sanctionsPage },
  )
  if (
    response.status !== 200 ||
    !response.body.subarray(0, 5).equals(Buffer.from('%PDF-'))
  )
    throw new Error(
      `DGT: the PDF of expediente ${expediente} did not come back (${String(response.status)})`,
    )
  return response.body.toString('base64')
}
