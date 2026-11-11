import { readInssContact } from '../../inss/contact/readInssContact'
import type { Command } from '../types/Command'

/** `ventanilla-unica inss contacto`: the mobile and e-mail of Tu Seguridad Social. */
export const inssContacto: Command = {
  portal: 'inss',
  action: 'contacto',
  description:
    'Read the mobile and e-mail Tu Seguridad Social (INSS) holds ("Tus datos")',
  options: [],
  run: async (client): Promise<unknown> => readInssContact(client),
}
