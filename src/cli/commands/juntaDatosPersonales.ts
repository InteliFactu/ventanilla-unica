import { readStaContactData } from '../../sta/contact/readStaContactData'
import type { Command } from '../types/Command'

/** `ventanilla-unica junta datos-personales`: the contact data and identity the sede holds. */
export const juntaDatosPersonales: Command = {
  portal: 'junta',
  action: 'datos-personales',
  description:
    "Read the holder's phone, e-mail (and whether the sede shows them as confirmed), name, NIF and addresses at the Junta de Extremadura sede (tramites.juntaex.es), without pressing Modificar",
  options: [],
  run: async (client): Promise<unknown> => readStaContactData(client, 'junta'),
}
