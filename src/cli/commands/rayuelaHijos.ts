import { listRayuelaChildren } from '../../rayuela/children/listRayuelaChildren'
import type { Command } from '../types/Command'
/** Read Rayuela children without a certificate. */
export const rayuelaHijos: Command = {
  portal: 'rayuela',
  action: 'hijos',
  description: 'Read Rayuela children',
  login: 'password',
  options: [],
  run: async (client) => listRayuelaChildren(client),
}
