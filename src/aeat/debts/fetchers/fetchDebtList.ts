import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** Open the NIF form before submitting it to read 'Relación de deudas'. */
export const fetchDebtList = async (
  client: HttpClient,
  nif: string,
): Promise<string> => {
  const url = `${aeatBaseUrl}/wlpl/SRVO-JDIT/ConsultaDdas`
  const defaultCharset = 'iso-8859-15'
  await client.request(url, { defaultCharset })
  const response = await client.request(url, {
    method: 'POST',
    form: {
      fnif: nif,
      faccion: 'CONS_DDAS',
      faccionboton: 'SALTAR',
      flistadoselecc: '',
      ACEPTAR: 'Aceptar',
    },
    defaultCharset,
  })
  if (response.status !== 200)
    throw new Error(`AEAT: debt query returned HTTP ${String(response.status)}`)
  return response.text
}
