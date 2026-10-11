import { planAddressChange } from '../../tgss/personalData/planAddressChange'
import { validateAddressUpdate } from '../../tgss/personalData/validators/validateAddressUpdate'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const tgssDomicilio: Command = {
  portal: 'tgss',
  action: 'domicilio',
  description:
    'Plan changing the domicile the Seguridad Social holds (--tipo-via, --via, --numero, --piso, --puerta, --codigo-postal, --localidad); plan only',
  options: [
    'tipo-via',
    'via',
    'numero',
    'bis',
    'bloque',
    'escalera',
    'piso',
    'puerta',
    'codigo-postal',
    'localidad',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    planAddressChange(
      client,
      validateAddressUpdate(options),
      isConfirmed(options),
    ),
}
