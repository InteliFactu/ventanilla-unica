import { listTeaExpedientes } from '../../tea/expedientes/listTeaExpedientes'
import type { Command } from '../types/Command'

/** `ventanilla-unica tea expedientes`: whether the TEA hold a reclamación for the holder. */
export const teaExpedientes: Command = {
  portal: 'tea',
  action: 'expedientes',
  description:
    'Whether the Tribunales Económico-Administrativos hold a case for the certificate holder ("Mis expedientes"); refuses, reading nothing, when the list has rows (their layout is not captured yet)',
  options: ['nif'],
  run: async (client, options) => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    return listTeaExpedientes(client, nif)
  },
}
