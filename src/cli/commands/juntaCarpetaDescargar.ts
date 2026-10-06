import { downloadJuntaCarpetaNotification } from '../../gobex/notifications/downloadJuntaCarpetaNotification'
import type { Command } from '../types/Command'

/** `ventanilla-unica junta carpeta-descargar`: the PDF of an already accepted Carpeta Ciudadana notification. */
export const juntaCarpetaDescargar: Command = {
  portal: 'junta',
  action: 'carpeta-descargar',
  description:
    'Download the PDF of a notification already accepted ("Notificado") in the Junta de Extremadura Carpeta Ciudadana (--id <notification number> --out d); refuses a pending one, which only carpeta-comparecer can open',
  options: ['id'],
  run: async (client, options): Promise<unknown> => {
    const id = options['id']
    const outDir = options['out']
    if (!id) throw new Error('--id is required (the notification number)')
    if (!outDir) throw new Error('--out is required (where to save the PDF)')
    return downloadJuntaCarpetaNotification(client, id, outDir)
  },
}
