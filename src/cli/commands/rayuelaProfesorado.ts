import { listRayuelaTeachers } from '../../rayuela/teachers/listRayuelaTeachers'
import type { Command } from '../types/Command'
/** Read Rayuela teachers without a certificate. */
export const rayuelaProfesorado: Command = {
  portal: 'rayuela',
  action: 'profesorado',
  description: 'Read Rayuela teachers',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) => listRayuelaTeachers(client, options['hijo']),
}
