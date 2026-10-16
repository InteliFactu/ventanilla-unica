import type { CliOptions } from '../../../cli/types/CliOptions'
import { isEmailAddress } from '../../../rolece/validators/isEmailAddress'
import type { NotaContact } from '../types/NotaContact'

/** `--email` and `--telefono`, both required by the identification form. */
export const validateNotaContact = (options: CliOptions): NotaContact => {
  const email = options['email']?.trim() ?? ''
  if (!isEmailAddress(email))
    throw new Error('--email must be the address the nota is sent to')
  const telefono = (options['telefono'] ?? '').replaceAll(/[\s.-]/g, '')
  if (!/^\+?\d{9,15}$/.test(telefono))
    throw new Error('--telefono must be a phone number')
  return { email, telefono }
}
