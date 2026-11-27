import { readRayuelaTrackingPage } from '../../rayuela/tracking/readRayuelaTrackingPage'
import type { Command } from '../types/Command'

export const rayuelaConductas: Command = {
  portal: 'rayuela',
  action: 'conductas',
  description: 'Read the pupil’s disciplinary incidents',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) =>
    readRayuelaTrackingPage(client, 'conductas', options['hijo']),
}
