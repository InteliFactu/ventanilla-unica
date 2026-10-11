import { updateContactData } from '../../tgss/personalData/updateContactData'
import { validateContactUpdate } from '../../tgss/personalData/validators/validateContactUpdate'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const tgssContacto: Command = {
  portal: 'tgss',
  action: 'contacto',
  description:
    'Plan changing the mobile, e-mail and landline the Seguridad Social holds (--movil, --correo, --fijo); --confirmar si to save',
  options: ['movil', 'correo', 'fijo'],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    updateContactData(
      client,
      validateContactUpdate(options),
      isConfirmed(options),
    ),
}
