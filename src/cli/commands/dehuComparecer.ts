import { appearAtNotifications } from '../../dehu/appearance/appearAtNotifications'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica dehu comparecer`: open (comparecer) pending DEHU notifications. */
export const dehuComparecer: Command = {
  portal: 'dehu',
  action: 'comparecer',
  description:
    'Appear (comparecer) at pending DEHU notifications. Without --confirmar si it only lists which of --id (comma-separated identifiers) are pending and plans; confirmed, it opens each, which counts as notified today and STARTS every legal deadline the act carries, then saves the document and the acuse with --out',
  options: ['id'],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const ids = (options['id'] ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '')
    if (ids.length === 0)
      throw new Error('--id is required (one or more DEHU identifiers)')
    return appearAtNotifications(client, {
      ids,
      confirm: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
