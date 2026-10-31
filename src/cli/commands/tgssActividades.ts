import { readAutonomousActivities } from '../../tgss/autonomousActivities/readAutonomousActivities'
import type { Command } from '../types/Command'

export const tgssActividades: Command = {
  portal: 'tgss',
  action: 'actividades',
  description:
    "Download the holder's 'informe de actividades de trabajo autónomo' from Importass: every activity communicated to the Seguridad Social with the company and role it is tied to (RD 504/2022); the PDF with --out",
  options: [],
  run: async (client, options): Promise<unknown> =>
    readAutonomousActivities(client, options['out']),
}
