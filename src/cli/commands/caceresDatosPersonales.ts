import { readStaContactData } from '../../sta/contact/readStaContactData'
import type { Command } from '../types/Command'

/** `ventanilla-unica caceres datos-personales`: the contact data and identity the sede holds. */
export const caceresDatosPersonales: Command = {
  portal: 'caceres',
  action: 'datos-personales',
  description:
    "Read the holder's phone, e-mail (and whether the sede shows them as confirmed), name, NIF and addresses at the Ayuntamiento de Cáceres sede (sede.caceres.es), without pressing Modificar",
  options: [],
  run: async (client): Promise<unknown> =>
    readStaContactData(client, 'caceres'),
}
