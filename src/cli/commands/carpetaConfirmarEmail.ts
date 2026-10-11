import { confirmEmail } from '../../carpeta/alerts/confirmEmail'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica carpeta confirmar-email --enlace <link> [--confirmar si]`: verify the alert email. */
export const carpetaConfirmarEmail: Command = {
  portal: 'carpeta',
  action: 'confirmar-email',
  description:
    'Follow the confirmation link the Carpeta Ciudadana mailed (--enlace, the link or its hashToken); --confirmar si marks the address verified',
  options: ['enlace'],
  effect: 'write',
  run: async (client, options) => {
    const link = options['enlace']
    if (!link) throw new Error('--enlace is required')
    return confirmEmail(client, link, isConfirmed(options))
  },
}
