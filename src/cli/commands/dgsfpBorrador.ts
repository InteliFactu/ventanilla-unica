import { readDgsfpComplaintDraft } from '../../dgsfp/readDgsfpComplaintDraft'
import type { Command } from '../types/Command'

export const dgsfpBorrador: Command = {
  portal: 'dgsfp',
  action: 'borrador',
  description: 'Check whether the holder has a saved DGSFP complaint draft',
  options: [],
  effect: 'read',
  run: async (client, _options, identity): Promise<unknown> => {
    if (!identity) {
      throw new Error(
        'dgsfp borrador needs the holder certificate (--cert/--key)',
      )
    }
    return { hasDraft: await readDgsfpComplaintDraft(client, identity) }
  },
}
