import { runYouthGuaranteeCommand } from '../../sepe/youthGuarantee/runYouthGuaranteeCommand'
import type { Command } from '../types/Command'

export const sepeGarantiaJuvenil: Command = {
  portal: 'sepe',
  action: 'garantia-juvenil',
  description:
    'Read Garantía Juvenil status, dates, PDFs (--out), or inscription fields; --inscribir si --respuestas JSON plans an inscription, --confirmar si submits it',
  options: [
    'inscribir',
    'respuestas',
    'pin-fichero',
    'enlace-fichero',
    'sms',
    'correo',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    runYouthGuaranteeCommand(client, options),
}
