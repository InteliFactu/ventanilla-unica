import type { CliOptions } from '../../../cli/types/CliOptions'
import type { StaContactQuery } from '../types/StaContactQuery'

/** Check `--correo` (required) and `--telefono` (optional) before any request. */
export const validateContactQuery = (options: CliOptions): StaContactQuery => {
  const email = (options['correo'] ?? '').trim()
  const phone = (options['telefono'] ?? '').replace(/\s/g, '')
  const problems = [
    /^[^\s@]+@[^\s@]+$/.test(email) &&
    email.split('@')[1]?.includes('.') === true
      ? ''
      : '--correo must be an e-mail address',
    phone === '' || /^\+?\d{9,15}$/.test(phone)
      ? ''
      : '--telefono must be a phone number',
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return { phone, email }
}
