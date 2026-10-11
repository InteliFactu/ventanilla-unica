import { readHolderData } from '../../dgt/holder/readHolderData'
import type { Command } from '../types/Command'

/** `ventanilla-unica dgt datos --nif <NIF>`: what the DGT holds about the holder. */
export const dgtDatos: Command = {
  portal: 'dgt',
  action: 'datos',
  description:
    'What the DGT holds about the holder: identity, the postal address it notifies to, and the email and phone it has',
  options: ['nif'],
  run: async (client, options) => {
    const nif = options['nif']?.trim().toUpperCase()
    if (!nif) throw new Error('--nif is required')
    return readHolderData(client, nif)
  },
}
