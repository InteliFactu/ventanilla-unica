import { readRayuelaTrackingPage } from '../../rayuela/tracking/readRayuelaTrackingPage'
import type { Command } from '../types/Command'

export const rayuelaExamenes: Command = {
  portal: 'rayuela',
  action: 'examenes',
  description: 'Read the pupil’s exams',
  login: 'password',
  options: ['hijo'],
  run: async (client, options) =>
    readRayuelaTrackingPage(client, 'examenes', options['hijo']),
}
