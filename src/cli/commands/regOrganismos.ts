import type { HttpClient } from '../../http/types/HttpClient'
import { searchOrganisms } from '../../reg/organisms/searchOrganisms'
import type { CliOptions } from '../types/CliOptions'
import type { Command } from '../types/Command'

export const regOrganismos: Command = {
  portal: 'reg',
  action: 'organismos',
  description:
    'Search the DIR3 units a REG entry can be addressed to by name (--buscar text); the cdUtOrganic code is what reg presentar --organismo takes',
  options: ['buscar'],
  run: async (client: HttpClient, options: CliOptions): Promise<unknown> => {
    const text = options['buscar']
    if (!text) throw new Error('reg organismos needs --buscar')
    return searchOrganisms(client, text)
  },
}
