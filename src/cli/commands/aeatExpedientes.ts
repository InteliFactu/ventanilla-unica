import { listAeatExpedientes } from '../../aeat/expedientes/listAeatExpedientes'
import { actAsAeatHolder } from '../../aeat/session/actAsAeatHolder'
import type { Command } from '../types/Command'

export const aeatExpedientes: Command = {
  portal: 'aeat',
  action: 'expedientes',
  description:
    'Read the holder’s AEAT Mis Expedientes list and its dated acts; --nombre acts for a represented holder',
  options: ['nif', 'nombre'],
  run: async (client, options, identity) => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    await actAsAeatHolder(client, identity, nif, options['nombre'])
    return listAeatExpedientes(client, nif)
  },
}
