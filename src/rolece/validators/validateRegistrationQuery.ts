import type { CliOptions } from '../../cli/types/CliOptions'
import { validateNif } from '../../tools/nif/validators/validateNif'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import { validateNotificationEmails } from './validateNotificationEmails'
import { validateRoleceNif } from './validateRoleceNif'

/** Check `rolece solicitud` options before any request; the form marks every one of these as required. */
export const validateRegistrationQuery = (
  options: CliOptions,
): RegistrationQuery => {
  const nif = validateRoleceNif(options['nif'])
  if (validateNif(nif).tipo !== 'persona-juridica')
    throw new Error(`--nif ${nif} is not a legal entity's NIF`)
  const comunidad = options['comunidad']?.trim()
  const provincia = options['provincia']?.trim()
  if (!comunidad) throw new Error('--comunidad is required (e.g. Extremadura)')
  if (!provincia) throw new Error('--provincia is required (e.g. Cáceres)')
  return {
    nif,
    comunidad,
    provincia,
    ...validateNotificationEmails(options),
    escritura: options['escritura'],
    poderes: options['poderes'],
  }
}
