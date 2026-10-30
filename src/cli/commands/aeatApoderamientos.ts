import { listAeatPowers } from '../../aeat/powers/listAeatPowers'
import { powerDirectionFromOption } from '../../aeat/powers/mappers/powerDirectionFromOption'
import type { Command } from '../types/Command'

/** `ventanilla-unica aeat apoderamientos --nif <NIF> [--tipo otorgados|recibidos]`: the Registro de apoderamientos, read-only. */
export const aeatApoderamientos: Command = {
  portal: 'aeat',
  action: 'apoderamientos',
  description:
    'The Registro de apoderamientos of the holder: the powers it granted (--tipo otorgados, default) or the ones granted to it (--tipo recibidos); lists only, never revokes (--nif)',
  options: ['nif', 'tipo'],
  run: async (client, options) => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    return listAeatPowers(
      client,
      nif,
      powerDirectionFromOption(options['tipo']),
    )
  },
}
