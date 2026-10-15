import type { HttpClient } from '../../http/types/HttpClient'
import { readRegistry } from '../../reg/registries/readRegistry'
import type { CliOptions } from '../types/CliOptions'
import type { Command } from '../types/Command'

export const regRegistro: Command = {
  portal: 'reg',
  action: 'registro',
  description:
    'Show one REG entry by its uuid from `reg registros`: data, documents and SIR trace; --out downloads every document, the signed justificante included',
  options: ['uuid'],
  run: async (client: HttpClient, options: CliOptions): Promise<unknown> => {
    const uuid = options['uuid']
    if (!uuid) throw new Error('reg registro needs --uuid')
    return readRegistry(client, uuid, options['out'])
  },
}
