import type { HttpClient } from '../../http/types/HttpClient'
import { openRegSession } from '../session/openRegSession'
import { fetchOrganism } from './fetchers/fetchOrganism'
import { fetchRegAddress } from './fetchers/fetchRegAddress'
import type { PreparedRegFiling } from './types/PreparedRegFiling'
import type { RegFilingQuery } from './types/RegFilingQuery'
import { readFilingPdfs } from './validators/readFilingPdfs'

/** The read-only half: check the PDFs, log in, resolve the addressee and the address codes. */
export const prepareRegFiling = async (
  client: HttpClient,
  query: RegFilingQuery,
): Promise<PreparedRegFiling> => {
  const pdfs = await readFilingPdfs(query.documents)
  const session = await openRegSession(client)
  return {
    session,
    organism: await fetchOrganism(client, session.token, query.organism),
    address: await fetchRegAddress(client, session.token, query),
    pdfs,
  }
}
