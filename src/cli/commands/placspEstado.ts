import { readPlacspStatus } from '../../placsp/status/readPlacspStatus'
import type { Command } from '../types/Command'

export const placspEstado: Command = {
  portal: 'placsp',
  action: 'estado',
  description:
    'Whether an e-mail already has a PLACSP (Plataforma de Contratación) operator account, by the self-registration availability check; creates nothing',
  options: ['email'],
  run: async (client, options): Promise<unknown> =>
    readPlacspStatus(client, options['email']),
}
