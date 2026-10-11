import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** GET "Canales de contacto para recibir avisos" (service MDAPL); with the certificate it redirects to the holder's Detalle page. */
export const fetchAvisosDetail = async (
  client: HttpClient,
): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/TOAG-JDIT/Identificacion?COD_SERVICIO=MDAPL`,
  )
  if (response.status !== 200)
    throw new Error(
      `AEAT: the avisos channels page answered HTTP ${String(response.status)}`,
    )
  return response.text
}
