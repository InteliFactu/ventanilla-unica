import { requestEmailVerification } from '../../carpeta/alerts/requestEmailVerification'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica carpeta email --email m [--confirmar si]`: set the Carpeta Ciudadana's alert email. */
export const carpetaEmail: Command = {
  portal: 'carpeta',
  action: 'email',
  description:
    'Set the email the state Carpeta Ciudadana sends alerts to (--email); --confirmar si records it and has the Carpeta mail a confirmation link, which `carpeta confirmar-email` completes',
  options: ['email'],
  effect: 'write',
  run: async (client, options) => {
    const email = options['email']
    if (!email) throw new Error('--email is required')
    return requestEmailVerification(client, email, isConfirmed(options))
  },
}
