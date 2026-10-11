import type { CliOptions } from '../../../cli/types/CliOptions'
import type { ContactUpdate } from '../types/ContactUpdate'
import { isEmailAddress } from './isEmailAddress'
import { isPhoneNumber } from './isPhoneNumber'

/** `--movil` (nine digits, spaces allowed), `--correo` and optional `--fijo`, as the Importass modal accepts them. */
export const validateContactUpdate = (options: CliOptions): ContactUpdate => {
  const mobile = options['movil']?.replaceAll(/\s/g, '') ?? ''
  const email = options['correo']?.trim() ?? ''
  const landline = options['fijo']?.replaceAll(/\s/g, '')
  if (!isPhoneNumber(mobile))
    throw new Error('--movil is required: nine digits, e.g. 600123123')
  if (!isEmailAddress(email))
    throw new Error('--correo is required: an e-mail address')
  if (landline !== undefined && !isPhoneNumber(landline))
    throw new Error('--fijo must be nine digits')
  return { mobile, email, landline }
}
