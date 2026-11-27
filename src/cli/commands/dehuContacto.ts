import { readDehuContact } from '../../dehu/contact/readDehuContact'
import type { Command } from '../types/Command'

/** `ventanilla-unica dehu contacto`: the holder's read-only contact record. */
export const dehuContacto: Command = {
  portal: 'dehu',
  action: 'contacto',
  description:
    'Read DEHU notice emails and their confirmation status, the stored phone field, and notice hours',
  options: [],
  run: async (client) => readDehuContact(client),
}
