import type { HttpClient } from '../../../http/types/HttpClient'
import { registryApiPath } from '../registryApiPath'
import type { RegistrySession } from '../types/RegistrySession'
import { registryHeaders } from './registryHeaders'

/**
 * `POST /requests/<procedure>` with the whole request; the body's `mode`
 * decides whether it is a draft save, the freeze before signing or the
 * submission. The answer is empty for drafts and a small JSON otherwise.
 */
export const saveRegistryRequest = async (
  client: HttpClient,
  session: RegistrySession,
  body: Readonly<Record<string, unknown>>,
): Promise<Readonly<Record<string, unknown>>> => {
  const { origin, procedureId } = session
  const response = await client.request(
    `${origin}${registryApiPath}/requests/${procedureId}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...registryHeaders(client, origin),
        'Content-Type': 'application/json',
      },
      timeoutMs: 180_000,
    },
  )
  if (response.status !== 200)
    throw new Error(
      `registry save (${String(body['mode'])}) answered ${String(response.status)}: ${response.text.slice(0, 300)}`,
    )
  return response.text.trim() === ''
    ? {}
    : (JSON.parse(response.text) as Record<string, unknown>)
}
