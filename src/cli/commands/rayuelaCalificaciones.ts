import { readRayuelaGrades } from '../../rayuela/grades/readRayuelaGrades'
import type { Command } from '../types/Command'
/** Read Rayuela grades without a certificate. */
export const rayuelaCalificaciones: Command = {
  portal: 'rayuela',
  action: 'calificaciones',
  description:
    'Read Rayuela grades (--curso 2025 or 2025-2026 for a past year)',
  login: 'password',
  options: ['hijo', 'curso'],
  run: async (client, options) =>
    readRayuelaGrades(client, options['hijo'], options['curso']),
}
