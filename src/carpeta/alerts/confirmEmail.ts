import type { HttpClient } from '../../http/types/HttpClient'
import { fetchEmailConfirmation } from './fetchers/fetchEmailConfirmation'
import { readHashToken } from './parsers/readHashToken'
import { readOutcome } from './parsers/readOutcome'
import type { EmailConfirmation } from './types/EmailConfirmation'

/** `carpeta confirmar-email`: follow the link the Carpeta mailed, which marks the address verified. */
export const confirmEmail = async (
  client: HttpClient,
  link: string,
  confirmed: boolean,
): Promise<EmailConfirmation> => {
  const hashToken = readHashToken(link)
  if (!confirmed) return { confirmed: false }
  const outcome = readOutcome(
    await fetchEmailConfirmation(client, hashToken),
    'confirmacionEmail',
  )
  return { confirmed: true, ...outcome }
}
