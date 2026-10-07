import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** Submit the root AEAT grouping shown by Mis Expedientes, without opening acts. */
export const fetchExpedienteList = async (
  client: HttpClient,
): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/TEWV-CORE/ResumenVlt`,
    {
      method: 'POST',
      form: {
        nifa: '',
        nifc: '',
        nifr: '',
        sim: '',
        slp: '1',
        cri: 'L-0-0000000001',
      },
      defaultCharset: 'iso-8859-15',
    },
  )
  if (response.status !== 200)
    throw new Error(`AEAT: expediente list HTTP ${String(response.status)}`)
  return response.text
}
