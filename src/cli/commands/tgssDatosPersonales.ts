import { readPersonalData } from '../../tgss/personalData/readPersonalData'
import type { Command } from '../types/Command'

export const tgssDatosPersonales: Command = {
  portal: 'tgss',
  action: 'datos-personales',
  description:
    'Read the identity, phones, e-mail and domicile the Seguridad Social holds (Importass "Tus datos personales")',
  options: [],
  run: async (client): Promise<unknown> =>
    (await readPersonalData(client)).data,
}
