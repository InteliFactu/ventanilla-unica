import { readRayuelaTrackingPage } from '../../rayuela/tracking/readRayuelaTrackingPage'
import type { Command } from '../types/Command'

export const rayuelaNotasClase: Command = {
  portal: 'rayuela',
  action: 'notas-clase',
  description: 'Read the pupil’s class marks',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) =>
    readRayuelaTrackingPage(client, 'notas-clase', options['hijo']),
}
