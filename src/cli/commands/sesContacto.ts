import { readSesContact } from '../../ses/contact/readSesContact'
import type { Command } from '../types/Command'

/** `ventanilla-unica ses contacto`: the e-mail and phones of Centro de Salud Online. */
export const sesContacto: Command = {
  portal: 'ses',
  action: 'contacto',
  description:
    'Read the e-mail and phones the Servicio Extremeño de Salud holds (Centro de Salud Online, "Mis datos")',
  options: [],
  run: async (client): Promise<unknown> => readSesContact(client),
}
