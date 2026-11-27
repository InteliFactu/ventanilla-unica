import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../../session/carpetaUrls'

export const fetchEmploymentRegistration = async (
  client: HttpClient,
  token: string,
  date: string | undefined,
): Promise<string> => {
  const url =
    date === undefined
      ? `${carpetaUrls.origin}/api/empleo`
      : `${carpetaUrls.origin}/api/empleo/fecha?fechaInscripcion=${encodeURIComponent(date)}`
  const response = await client.request(url, {
    method: 'GET',
    followRedirects: false,
    headers: { Accept: 'application/json', Authorization: token },
  })
  if (response.status !== 200)
    throw new Error(
      `Carpeta: the employment query returned HTTP ${String(response.status)}`,
    )
  return response.text
}
