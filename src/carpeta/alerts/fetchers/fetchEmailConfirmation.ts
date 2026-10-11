import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../../session/carpetaUrls'

/** GET `confirmar-email`: public, as the front's interceptor exempts it from the token. */
export const fetchEmailConfirmation = async (
  client: HttpClient,
  hashToken: string,
): Promise<string> => {
  const response = await client.request(
    `${carpetaUrls.confirmEmail}?hashToken=${encodeURIComponent(hashToken)}`,
    { headers: { Accept: 'application/json' } },
  )
  return response.text
}
