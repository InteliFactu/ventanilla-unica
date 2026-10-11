import { readAlertSettings } from '../../carpeta/alerts/readAlertSettings'
import type { Command } from '../types/Command'

/** `ventanilla-unica carpeta avisos`: the alert email and alerts of the state Carpeta Ciudadana. */
export const carpetaAvisos: Command = {
  portal: 'carpeta',
  action: 'avisos',
  description:
    'The email the state Carpeta Ciudadana sends its alerts to, whether it is verified, and the alert groups switched on',
  options: [],
  run: async (client) => readAlertSettings(client),
}
