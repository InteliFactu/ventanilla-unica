import { readEmploymentRegistration } from '../../carpeta/employment/readEmploymentRegistration'
import type { Command } from '../types/Command'

export const carpetaDemandaEmpleo: Command = {
  portal: 'carpeta',
  action: 'demanda-empleo',
  description:
    "Read the holder's job-seeker registration from Mi Carpeta Ciudadana, today or on --fecha DD/MM/YYYY",
  options: ['fecha'],
  effect: 'read',
  run: async (client, options): Promise<unknown> =>
    readEmploymentRegistration(client, options['fecha']),
}
