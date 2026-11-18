import { sweepAeatDebts } from '../../aeat/debts/sweepAeatDebts'
import { certificateNifs } from '../../certificate/certificateNifs'
import type { Command } from '../types/Command'

/** `ventanilla-unica aeat deudas --nif <NIF>`: pending debts, detail and SRAF agreements. */
export const aeatDeudas: Command = {
  portal: 'aeat',
  action: 'deudas',
  description:
    'Pending debts, their detail and deferral agreements at the Agencia Tributaria',
  options: ['nif'],
  run: async (client, options, identity) => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    const holders = identity ? certificateNifs(identity) : [nif]
    return sweepAeatDebts(client, nif, holders.includes(nif))
  },
}
