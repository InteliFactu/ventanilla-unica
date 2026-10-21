import { registerCarpetaThirdParty } from '../../gobex/filing/registerCarpetaThirdParty'
import { validateThirdPartyIban } from '../../gobex/filing/validators/validateThirdPartyIban'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** The holder's payment account in the Junta third-party register. */
export const juntaAltaTerceros: Command = {
  portal: 'junta',
  action: 'alta-terceros',
  effect: 'write',
  description:
    'Register the holder and --iban for Junta payments (P5145), authorizing AEAT identity and bank-ownership verification. --telefono and --out required. Only --confirmar si creates, signs and files the application; it never requests BAJA or changes a grant Annex I.',
  options: ['iban', 'telefono'],
  run: async (client, options, identity): Promise<unknown> => {
    if (
      !identity ||
      !options['iban'] ||
      !options['telefono'] ||
      !options['out']
    )
      throw new Error(
        'junta alta-terceros needs --cert/--key, --iban, --telefono and --out',
      )
    if (!/^\d{9}$/.test(options['telefono']))
      throw new Error('Junta: --telefono must have nine digits')
    return registerCarpetaThirdParty(
      client,
      identity,
      {
        iban: validateThirdPartyIban(options['iban']),
        phone: options['telefono'],
      },
      { confirmed: isConfirmed(options), outDir: options['out'] },
    )
  },
}
