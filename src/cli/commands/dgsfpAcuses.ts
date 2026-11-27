import { listDgsfpReceipts } from '../../dgsfp/listDgsfpReceipts'
import type { Command } from '../types/Command'

export const dgsfpAcuses: Command = {
  portal: 'dgsfp',
  action: 'acuses',
  description:
    'List existing DGSFP registration receipts, optionally by exact --registro',
  options: ['registro'],
  effect: 'read',
  run: async (client, options, identity): Promise<unknown> => {
    if (!identity)
      throw new Error(
        'dgsfp acuses needs the holder certificate (--cert/--key)',
      )
    return listDgsfpReceipts(client, identity, options['registro'])
  },
}
