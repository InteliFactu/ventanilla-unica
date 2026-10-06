import { acceptJuntaCarpetaNotification } from '../../gobex/notifications/acceptJuntaCarpetaNotification'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica junta carpeta-comparecer`: accept a pending Carpeta Ciudadana notification. */
export const juntaCarpetaComparecer: Command = {
  portal: 'junta',
  action: 'carpeta-comparecer',
  description:
    'Accept (comparecer) a pending notification in the Junta de Extremadura Carpeta Ciudadana. Without --confirmar si it only finds --id and plans; confirmed, it accepts it, which counts as notified today and STARTS every legal deadline the act carries, then saves the PDF with --out. An already accepted one is only downloaded',
  options: ['id'],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const id = options['id']
    if (!id) throw new Error('--id is required (the notification number)')
    return acceptJuntaCarpetaNotification(client, {
      id,
      confirm: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
