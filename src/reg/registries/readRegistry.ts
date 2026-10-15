import type { HttpClient } from '../../http/types/HttpClient'
import { openRegSession } from '../session/openRegSession'
import { fetchRegistryReport } from './fetchers/fetchRegistryReport'
import type { RegistryReport } from './types/RegistryReport'

/** One of the holder's entries by its `uuid` (from `reg registros`); `outDir` downloads its documents. */
export const readRegistry = async (
  client: HttpClient,
  uuid: string,
  outDir: string | undefined,
): Promise<RegistryReport> => {
  const { token } = await openRegSession(client)
  return fetchRegistryReport(client, token, uuid, outDir)
}
