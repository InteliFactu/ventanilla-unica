import type { HttpClient } from '../../http/types/HttpClient'
import { buildEmailChangeBody } from './builders/buildEmailChangeBody'
import { buildSignedFields } from './builders/buildSignedFields'
import { fetchEmailForm } from './fetchers/fetchEmailForm'
import { fetchIsLegalPerson } from './fetchers/fetchIsLegalPerson'
import { submitEmailChange } from './fetchers/submitEmailChange'
import { readRequestOutcome } from './parsers/readRequestOutcome'
import { readUnsignedToken } from './parsers/readUnsignedToken'
import type { ContactEmailChange } from './types/ContactEmailChange'
import type { ContactEmailContext } from './types/ContactEmailContext'
import type { ContactEmailQuery } from './types/ContactEmailQuery'

/**
 * Ask Red.es to change an ES-NIC contact's email, signed with the holder's
 * certificate ("Tramitación con DNIe/Certificado"). Without `confirmed` it
 * only checks the form and the contact; filed, the change waits for the
 * registry's approval, after which password resets reach the new address.
 */
export const requestContactEmailChange = async (
  client: HttpClient,
  query: ContactEmailQuery,
  context: ContactEmailContext,
): Promise<ContactEmailChange> => {
  const token = readUnsignedToken(await fetchEmailForm(client))
  if (await fetchIsLegalPerson(client, query.identificador))
    throw new Error(
      `${query.identificador} is a legal person: Red.es also demands its NIF and powers, which this command does not attach`,
    )
  if (!context.confirmed) return { ...query, submitted: false }
  const body = buildEmailChangeBody(
    buildSignedFields(context.identity, token, query),
  )
  const message = readRequestOutcome(await submitEmailChange(client, body))
  return { ...query, submitted: true, message }
}
