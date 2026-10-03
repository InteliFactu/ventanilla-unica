import type { HttpClient } from '../../../http/types/HttpClient'
import { registryApiPath } from '../registryApiPath'
import { registryHeaders } from './registryHeaders'

/** GET one registry API resource and parse it; anything but 200 is an error. */
export const getRegistryJson = async <T>(
  client: HttpClient,
  origin: string,
  path: string,
): Promise<T> => {
  const response = await client.request(`${origin}${registryApiPath}${path}`, {
    headers: registryHeaders(client, origin),
  })
  if (response.status !== 200)
    throw new Error(`registry GET ${path} answered ${String(response.status)}`)
  return JSON.parse(response.text) as T
}
