import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { collectRegistryEntries } from './collectRegistryEntries'
import type { RegistryListing } from './types/RegistryListing'
import type { RegistryQuery } from './types/RegistryQuery'

/**
 * Read the entries that Carpeta Ciudadana exposes under "Escritos y
 * solicitudes", with their status annotations. A filing made elsewhere can
 * be looked up by registry number within its date range. Read-only.
 */
export const listRegistryEntries = async (
  client: HttpClient,
  query: RegistryQuery,
): Promise<RegistryListing> =>
  collectRegistryEntries(client, await loginWithCertificate(client), query)
