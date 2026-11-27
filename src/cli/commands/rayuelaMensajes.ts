import { listRayuelaMessages } from '../../rayuela/messages/listRayuelaMessages'
import { validateRayuelaTray } from '../../rayuela/messages/validators/validateRayuelaTray'
import type { Command } from '../types/Command'
/** Read Rayuela messages without a certificate. */
export const rayuelaMensajes: Command = {
  portal: 'rayuela',
  action: 'mensajes',
  description:
    'Read Rayuela messages (--bandeja ENV reads the sent box, --desde-id <id> keeps greater message ids)',
  login: 'password',
  options: ['bandeja', 'desde-id'],
  run: async (client, options) =>
    listRayuelaMessages(
      client,
      validateRayuelaTray(options['bandeja']),
      options['desde-id'],
    ),
}
