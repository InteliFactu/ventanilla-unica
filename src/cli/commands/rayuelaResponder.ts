import { replyToRayuelaMessage } from '../../rayuela/messages/reply/replyToRayuelaMessage'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'
/** Reply to one Rayuela inbox message; a write that only plans without `--confirmar si`. */
export const rayuelaResponder: Command = {
  portal: 'rayuela',
  action: 'responder',
  description:
    'Reply to a Rayuela inbox message (--id <message id> --texto <plain text>); the reply goes to the sender at once. --confirmar si to send',
  login: 'password',
  options: ['id', 'texto'],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const messageId = options['id']?.trim() ?? ''
    if (!/^\d+$/.test(messageId))
      throw new Error('--id (message id) is required')
    const body = options['texto'] ?? ''
    if (body.trim() === '') throw new Error('--texto (reply text) is required')
    return replyToRayuelaMessage(client, {
      messageId,
      body,
      confirm: isConfirmed(options),
    })
  },
}
