import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchOrganisms } from '../../organisms/fetchers/fetchOrganisms'
import type { Organism } from '../../organisms/types/Organism'

/** The DIR3 unit whose code is exactly `code`; the search also matches codes. */
export const fetchOrganism = async (
  client: HttpClient,
  token: string,
  code: string,
): Promise<Organism> => {
  const found = await fetchOrganisms(client, token, code)
  const organism = found.items.find((item) => item.cdUtOrganic === code)
  if (!organism)
    throw new Error(
      `REG: no DIR3 unit with code "${code}"; find it with reg organismos --buscar`,
    )
  return organism
}
