import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchEmailVerification } from './fetchers/fetchEmailVerification'
import { readOutcome } from './parsers/readOutcome'
import type { EmailVerification } from './types/EmailVerification'
import { isEmailAddress } from './validators/isEmailAddress'

/**
 * `carpeta email`: set the address the Carpeta Ciudadana mails its alerts
 * to. Without `confirmed` nothing is sent; confirmed, the Carpeta records the
 * address as pending and mails it a link that `carpeta confirmar-email`
 * (or a browser) completes.
 */
export const requestEmailVerification = async (
  client: HttpClient,
  email: string,
  confirmed: boolean,
): Promise<EmailVerification> => {
  if (!isEmailAddress(email))
    throw new Error(`--email ${email} is not an email address`)
  if (!confirmed) return { email, requested: false }
  const token = await loginWithCertificate(client)
  const outcome = readOutcome(
    await fetchEmailVerification(client, token, email),
    'verificacionEmail',
  )
  return { email, requested: true, ...outcome }
}
