import type { HttpClient } from '../../../http/types/HttpClient'
import { registryApiPath } from '../registryApiPath'
import type { RegistryExpediente } from '../types/RegistryExpediente'
import { registryHeaders } from './registryHeaders'

/**
 * The open expedientes a contribution can go to: `POST /people/info/expedientes`
 * with the interested party, as the SPA's documents step asks. It only reads.
 */
export const fetchPartyExpedientes = async (
  client: HttpClient,
  origin: string,
  party: Readonly<Record<string, unknown>>,
): Promise<readonly RegistryExpediente[]> => {
  const response = await client.request(
    `${origin}${registryApiPath}/people/info/expedientes`,
    {
      method: 'POST',
      body: JSON.stringify(party),
      headers: {
        ...registryHeaders(client, origin),
        'Content-Type': 'application/json',
      },
    },
  )
  if (response.status !== 200)
    throw new Error(`registry expedientes answered ${String(response.status)}`)
  return JSON.parse(response.text) as RegistryExpediente[]
}
