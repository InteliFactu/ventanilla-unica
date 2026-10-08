import type { CliOptions } from '../../../cli/types/CliOptions'
import type { ContactEmailQuery } from '../types/ContactEmailQuery'
import { isEmailShaped } from './isEmailShaped'

/** Read `--identificador` and `--email`, refusing a handle or address the portal would reject. */
export const validateContactEmailQuery = (
  options: CliOptions,
): ContactEmailQuery => {
  const identificador = (options['identificador'] ?? '').trim().toUpperCase()
  const email = (options['email'] ?? '').trim()
  if (!/^[0-9A-Z]+-ESNIC-F\d+$/.test(identificador))
    throw new Error(
      '--identificador must be an ES-NIC handle such as 1727AF1-ESNIC-F5',
    )
  if (!isEmailShaped(email)) throw new Error('--email must be an email address')
  return { identificador, email }
}
