import type { HttpClient } from '../../http/types/HttpClient'
import { listRegistries } from '../../reg/registries/listRegistries'
import { validatePage } from '../../reg/registries/validators/validatePage'
import type { CliOptions } from '../types/CliOptions'
import type { Command } from '../types/Command'

export const regRegistros: Command = {
  portal: 'reg',
  action: 'registros',
  description:
    "List the holder's entries in the Registro Electrónico General (REG, formerly REC), ten per page, newest first ([--pagina n])",
  options: ['pagina'],
  run: async (client: HttpClient, options: CliOptions): Promise<unknown> =>
    listRegistries(client, validatePage(options['pagina'])),
}
