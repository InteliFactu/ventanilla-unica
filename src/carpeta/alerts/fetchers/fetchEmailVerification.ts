import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../../session/carpetaUrls'

/** GET `verificar-email` (canal 0, email): the Carpeta stores the address and mails it a confirmation link. */
export const fetchEmailVerification = async (
  client: HttpClient,
  token: string,
  email: string,
): Promise<string> => {
  const query = new URLSearchParams({ email, canal: '0', lang: 'es' })
  const response = await client.request(
    `${carpetaUrls.verifyEmail}?${query.toString()}`,
    { headers: { Authorization: token, Accept: 'application/json' } },
  )
  return response.text
}
