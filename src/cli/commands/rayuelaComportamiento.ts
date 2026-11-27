import { readRayuelaTrackingPage } from '../../rayuela/tracking/readRayuelaTrackingPage'
import type { Command } from '../types/Command'

export const rayuelaComportamiento: Command = {
  portal: 'rayuela',
  action: 'comportamiento',
  description: 'Read the pupil’s behaviour entries',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) =>
    readRayuelaTrackingPage(client, 'comportamiento', options['hijo']),
}
