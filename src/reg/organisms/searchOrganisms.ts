import type { HttpClient } from '../../http/types/HttpClient'
import { openRegSession } from '../session/openRegSession'
import { fetchOrganisms } from './fetchers/fetchOrganisms'
import type { OrganismSearch } from './types/OrganismSearch'

/** Find the DIR3 code of the unit to address an entry to; the API needs a logged-in session even for this. */
export const searchOrganisms = async (
  client: HttpClient,
  text: string,
): Promise<OrganismSearch> => {
  const { token } = await openRegSession(client)
  return fetchOrganisms(client, token, text)
}
