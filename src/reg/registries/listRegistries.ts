import type { HttpClient } from '../../http/types/HttpClient'
import { callRegApi } from '../session/fetchers/callRegApi'
import { openRegSession } from '../session/openRegSession'
import { buildRegistrySearch } from './builders/buildRegistrySearch'
import type { RegistryListing } from './types/RegistryListing'
import type { RegistrySearchAnswer } from './types/RegistrySearchAnswer'

/** One page (ten rows, newest first) of the holder's entries in the REG, old REC ones included. */
export const listRegistries = async (
  client: HttpClient,
  page: number,
): Promise<RegistryListing> => {
  const session = await openRegSession(client)
  const answer = (await callRegApi(
    client,
    session.token,
    'registry/searchRegistry',
    buildRegistrySearch(page),
  )) as RegistrySearchAnswer
  return {
    holder: session.holder,
    page,
    totalPages: answer.totalPage,
    registries: answer.items,
  }
}
