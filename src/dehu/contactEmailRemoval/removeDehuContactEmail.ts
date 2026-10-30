import type { HttpClient } from '../../http/types/HttpClient'
import { fetchDehuContact } from '../contact/fetchers/fetchDehuContact'
import { readJwtUsername } from '../contact/parsers/readJwtUsername'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { confirmContactUpdate } from './confirmContactUpdate'
import { fetchContactLegalTextId } from './fetchers/fetchContactLegalTextId'
import { putDehuContact } from './fetchers/putDehuContact'
import { contactWithoutEmail } from './mappers/contactWithoutEmail'
import { remainingContactEmails } from './mappers/remainingContactEmails'
import type { DehuEmailRemoval } from './types/DehuEmailRemoval'
import { listsEmail } from './validators/listsEmail'

/**
 * `dehu quitar-email`: drop one email from the addresses DEHU mails its
 * notices of new notifications to. Without `confirmed` it only reads and
 * shows what would be left; confirmed, it sends the front's PUT, completes the
 * Cl@ve re-authentication that applies it, and reads the contact again.
 */
export const removeDehuContactEmail = async (
  client: HttpClient,
  email: string,
  confirmed: boolean,
): Promise<DehuEmailRemoval> => {
  const authData = await loginWithCertificate(client)
  const nif = readJwtUsername(authData)
  const current = await fetchDehuContact(client, authData, nif)
  const plan = contactWithoutEmail(current, email, '0')
  const result = {
    nif,
    removed: email,
    remaining: remainingContactEmails(plan),
  }
  if (!confirmed) return { ...result, applied: false, verified: false }
  const legalTextId = await fetchContactLegalTextId(client, authData)
  const body = contactWithoutEmail(current, email, legalTextId)
  await confirmContactUpdate(
    client,
    await putDehuContact(client, authData, nif, body),
  )
  const fresh = await fetchDehuContact(
    client,
    await loginWithCertificate(client),
    nif,
  )
  return { ...result, applied: true, verified: !listsEmail(fresh, email) }
}
