import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchDehuContact } from './fetchers/fetchDehuContact'
import { mapDehuContact } from './mappers/mapDehuContact'
import { readJwtUsername } from './parsers/readJwtUsername'
import type { DehuContact } from './types/DehuContact'

/** `dehu contacto`: the emails and phone DEHU sends its notices of new notifications to. Read-only. */
export const readDehuContact = async (
  client: HttpClient,
): Promise<DehuContact> => {
  const authData = await loginWithCertificate(client)
  const nif = readJwtUsername(authData)
  return mapDehuContact(await fetchDehuContact(client, authData, nif), nif)
}
