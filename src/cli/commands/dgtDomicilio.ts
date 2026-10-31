import { planDgtAddressChange } from '../../dgt/address/planDgtAddressChange'
import { validateDgtAddressQuery } from '../../dgt/address/validators/validateDgtAddressQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica dgt domicilio --nif <NIF> --tipo-via t --via v --numero n --codigo-postal c --municipio m --provincia p`. */
export const dgtDomicilio: Command = {
  portal: 'dgt',
  action: 'domicilio',
  description:
    'Plan changing the address the DGT notifies to by post (Cambio de domicilio, CDI): --tipo-via, --via, --numero, --planta, --puerta, --codigo-postal, --municipio, --provincia, --localidad; plan only',
  options: [
    'nif',
    'tipo-via',
    'via',
    'numero',
    'planta',
    'puerta',
    'codigo-postal',
    'municipio',
    'provincia',
    'localidad',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    planDgtAddressChange(
      client,
      validateDgtAddressQuery(options),
      isConfirmed(options),
    ),
}
