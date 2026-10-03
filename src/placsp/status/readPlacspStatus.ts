import { randomBytes } from 'node:crypto'

import type { HttpClient } from '../../http/types/HttpClient'
import { isEmailAddress } from '../../rolece/validators/isEmailAddress'
import { fetchAvailabilityCheck } from '../fetchers/fetchAvailabilityCheck'
import { readAvailability } from '../parsers/readAvailability'
import type { PlacspStatusResult } from '../types/PlacspStatusResult'

/**
 * Whether an e-mail already has a PLACSP operator account. PLACSP accounts
 * are user id + password with an e-mail, not tied to a certificate or a NIF
 * (the certificate is only asked to open a communication), so the e-mail is
 * the only handle a read can use: the self-registration page's availability
 * check. The user id it sends is a random probe so that only the e-mail
 * decides the answer.
 */
export const readPlacspStatus = async (
  client: HttpClient,
  email: string | undefined,
): Promise<PlacspStatusResult> => {
  if (!email || !isEmailAddress(email))
    throw new Error('--email is required: the address the account would use')
  const probe = `vu${randomBytes(6).toString('hex')}`
  const page = await fetchAvailabilityCheck(client, email, probe)
  const availability = readAvailability(page.text)
  return {
    email,
    ...availability,
    notes: [
      'PLACSP logs operators in with user id and password only ("Empresas" page); there is no certificate or Cl@ve login for the operator area.',
      ...(availability.account === 'none'
        ? [
            'No account uses this e-mail. Registering needs the self-registration form with a captcha and the activation link e-mailed to that address.',
          ]
        : []),
    ],
  }
}
