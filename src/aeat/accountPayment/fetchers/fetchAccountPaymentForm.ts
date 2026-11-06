import type { HttpClient } from '../../../http/types/HttpClient'
import { accountPaymentUrl } from '../accountPaymentUrl'

/** GET the blank LiquidacionesCuenta form; it prints the certificate's NIF and name. */
export const fetchAccountPaymentForm = async (
  client: HttpClient,
): Promise<string> => {
  const response = await client.request(accountPaymentUrl, {
    defaultCharset: 'iso-8859-15',
  })
  if (response.status !== 200)
    throw new Error(
      `AEAT: LiquidacionesCuenta answered HTTP ${String(response.status)}`,
    )
  return response.text
}
