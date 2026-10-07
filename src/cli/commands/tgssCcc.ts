import { readEmployerAccounts } from '../../tgss/employer/readEmployerAccounts'
import type { Command } from '../types/Command'

export const tgssCcc: Command = {
  portal: 'tgss',
  action: 'ccc',
  description:
    "List the holder's códigos de cuenta de cotización at the Seguridad Social with their situation (alta or baja, and since when) and the RED authorisation managing each",
  options: [],
  run: async (client): Promise<unknown> => readEmployerAccounts(client),
}
