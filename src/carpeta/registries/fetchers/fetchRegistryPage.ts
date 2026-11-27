import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../../session/carpetaUrls'

/** POST one page of `consultaRegistros` with the Carpeta token, as JSON text. Read-only. */
export const fetchRegistryPage = async (
  client: HttpClient,
  token: string,
  body: string,
): Promise<string> => {
  const response = await client.request(carpetaUrls.registries, {
    method: 'POST',
    body,
    followRedirects: false,
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  if (response.status !== 200)
    throw new Error(
      `Carpeta: consultaRegistros answered HTTP ${String(response.status)}`,
    )
  return response.text
}
