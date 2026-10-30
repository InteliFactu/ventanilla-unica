import { removeDehuContactEmail } from '../../dehu/contactEmailRemoval/removeDehuContactEmail'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica dehu quitar-email --email m [--confirmar si]`: stop DEHU mailing its notices to one address. */
export const dehuQuitarEmail: Command = {
  portal: 'dehu',
  action: 'quitar-email',
  description:
    'Remove one address (--email) from the emails DEHU mails its notices of new notifications to; without --confirmar si it only shows the emails that would remain',
  options: ['email'],
  effect: 'write',
  run: async (client, options) => {
    const email = options['email']
    if (!email) throw new Error('--email is required')
    return removeDehuContactEmail(client, email, isConfirmed(options))
  },
}
