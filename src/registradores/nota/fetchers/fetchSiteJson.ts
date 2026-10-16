import type { HttpClient } from '../../../http/types/HttpClient'
import { registradoresHeaders } from '../../session/registradoresHeaders'
import { siteUrl } from '../../session/siteUrl'

/**
 * A JSON helper of the identification page (`api/validate/sociedad`,
 * `api/location/towns`); refuses an answer that is not JSON, which is how a
 * lost session shows (the login page comes back).
 */
export const fetchSiteJson = async (
  client: HttpClient,
  path: string,
): Promise<unknown> => {
  const response = await client.request(siteUrl(path), {
    headers: { ...registradoresHeaders, Accept: 'application/json' },
  })
  try {
    return JSON.parse(response.text) as unknown
  } catch {
    throw new Error(
      `registradores: ${path.split('?')[0] ?? path} did not answer JSON (HTTP ${String(response.status)})`,
    )
  }
}
