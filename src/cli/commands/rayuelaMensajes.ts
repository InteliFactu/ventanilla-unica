import { listRayuelaMessages } from '../../rayuela/messages/listRayuelaMessages'
import { validateRayuelaTray } from '../../rayuela/messages/validators/validateRayuelaTray'
import type { Command } from '../types/Command'
/** Read Rayuela messages without a certificate. */
export const rayuelaMensajes: Command = {
  portal: 'rayuela',
  action: 'mensajes',
  description:
    'Read Rayuela messages (--bandeja ENV reads the sent box instead of the inbox)',
  login: 'password',
  options: ['bandeja'],
  run: async (client, options) =>
    listRayuelaMessages(client, validateRayuelaTray(options['bandeja'])),
}
