import type { CliOptions } from '../../cli/types/CliOptions'
import type { NotificationEmails } from '../types/NotificationEmails'
import { isEmailAddress } from './isEmailAddress'

/** `--email` and `--email-solicitante` (the company's address when absent), both required by the form. */
export const validateNotificationEmails = (
  options: CliOptions,
): NotificationEmails => {
  const email = options['email']?.trim() ?? ''
  const emailSolicitante = options['email-solicitante']?.trim() ?? email
  for (const [name, value] of [
    ['--email', email],
    ['--email-solicitante', emailSolicitante],
  ] as const)
    if (!isEmailAddress(value))
      throw new Error(
        `${name} must be an e-mail address the registry writes to`,
      )
  return { email, emailSolicitante }
}
