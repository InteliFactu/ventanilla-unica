import { listAeatExpedientes } from '../../aeat/expedientes/listAeatExpedientes'
import type { Command } from '../types/Command'

export const aeatExpedientes: Command = {
  portal: 'aeat',
  action: 'expedientes',
  description: 'Read the holder’s AEAT Mis Expedientes list and its dated acts',
  options: ['nif'],
  run: async (client, options) => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    return listAeatExpedientes(client, nif)
  },
}
