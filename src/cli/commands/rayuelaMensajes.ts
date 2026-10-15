import { listRayuelaMessages } from '../../rayuela/messages/listRayuelaMessages'
import type { Command } from '../types/Command'
/** Read Rayuela messages without a certificate. */
export const rayuelaMensajes: Command = {
  portal: 'rayuela',
  action: 'mensajes',
  description: 'Read Rayuela messages',
  login: 'password',
  options: [],
  run: async (client) => listRayuelaMessages(client),
}
