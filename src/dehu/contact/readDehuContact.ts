import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { readJwtUsername } from '../session/readJwtUsername'
import { fetchDehuContact } from './fetchers/fetchDehuContact'
import { mapDehuContact } from './mappers/mapDehuContact'
import type { DehuContact } from './types/DehuContact'

/** Read DEHU notice emails and the other fields in the holder's contact record. */
export const readDehuContact = async (
  client: HttpClient,
): Promise<DehuContact> => {
  const authData = await loginWithCertificate(client)
  const nif = readJwtUsername(authData)
  return mapDehuContact(await fetchDehuContact(client, authData, nif), nif)
}
