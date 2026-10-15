import { readRayuelaTimetable } from '../../rayuela/timetable/readRayuelaTimetable'
import type { Command } from '../types/Command'
/** Read Rayuela timetable without a certificate. */
export const rayuelaHorario: Command = {
  portal: 'rayuela',
  action: 'horario',
  description: 'Read Rayuela timetable',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) => readRayuelaTimetable(client, options['hijo']),
}
