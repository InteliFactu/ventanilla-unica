import { listRayuelaAbsences } from '../../rayuela/absences/listRayuelaAbsences'
import type { Command } from '../types/Command'
/** Read Rayuela absences without a certificate. */
export const rayuelaFaltas: Command = {
  portal: 'rayuela',
  action: 'faltas',
  description: 'Read Rayuela absences',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) => listRayuelaAbsences(client, options['hijo']),
}
