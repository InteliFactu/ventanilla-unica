import type { CliOptions } from '../../../cli/types/CliOptions'
import { isEmailShaped } from '../../../nic/contactEmail/validators/isEmailShaped'
import type { DgtContactQuery } from '../types/DgtContactQuery'
import { normalizeDgtPhone } from './normalizeDgtPhone'

/** Read `--nif`, `--correo` and `--telefono`, refusing values the sede would reject. */
export const validateDgtContactQuery = (
  options: CliOptions,
): DgtContactQuery => {
  const nif = (options['nif'] ?? '').trim().toUpperCase()
  const email = (options['correo'] ?? '').trim()
  const telefono = normalizeDgtPhone(options['telefono'] ?? '')
  if (!/^[0-9XYZ]\d{7}[A-Z]$/.test(nif))
    throw new Error('--nif must be the holder NIF/NIE, e.g. 12345678Z')
  if (!isEmailShaped(email))
    throw new Error('--correo must be an email address')
  if (telefono === undefined)
    throw new Error(
      '--telefono must be a phone number, e.g. 600000000 or +34600000000',
    )
  return { nif, email, telefono }
}
