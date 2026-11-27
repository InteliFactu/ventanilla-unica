import { readRayuelaTrackingPage } from '../../rayuela/tracking/readRayuelaTrackingPage'
import type { Command } from '../types/Command'

export const rayuelaTrabajos: Command = {
  portal: 'rayuela',
  action: 'trabajos',
  description: 'Read the pupil’s homework',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) =>
    readRayuelaTrackingPage(client, 'trabajos', options['hijo']),
}
