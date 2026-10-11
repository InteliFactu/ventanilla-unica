import { readDehuContact } from '../../dehu/contact/readDehuContact'
import type { Command } from '../types/Command'

/** `ventanilla-unica dehu contacto`: the emails and phone DEHU sends its notices to. */
export const dehuContacto: Command = {
  portal: 'dehu',
  action: 'contacto',
  description:
    'The emails (and whether each is confirmed) and phone DEHU sends its notices of new notifications to',
  options: [],
  run: async (client) => readDehuContact(client),
}
