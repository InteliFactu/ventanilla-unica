import { readDayCount } from '../../carpeta/alerts/parsers/readDayCount'
import { readGroupLevels } from '../../carpeta/alerts/parsers/readGroupLevels'
import { planAlertGroups } from '../../carpeta/alerts/planAlertGroups'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** Preview changes to selected Carpeta Ciudadana alert groups. */
export const carpetaActivarAvisos: Command = {
  portal: 'carpeta',
  action: 'activar-avisos',
  description:
    'Plan enabling email for calendar groups (--grupos, levels from `carpeta avisos`) with --primer-aviso and --segundo-aviso in days. Plan only.',
  options: ['grupos', 'primer-aviso', 'segundo-aviso', 'confirmar'],
  run: async (client, options): Promise<unknown> => {
    if (isConfirmed(options))
      throw new Error('Carpeta: alert group changes are plan only')
    const groups = options['grupos']
    if (!groups) throw new Error('--grupos is required')
    return planAlertGroups(client, readGroupLevels(groups), {
      first: readDayCount(options['primer-aviso'], 'primer-aviso'),
      second: readDayCount(options['segundo-aviso'], 'segundo-aviso'),
    })
  },
}
