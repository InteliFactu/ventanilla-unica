import { listNotifications } from '../../dehu/notifications/listNotifications'
import type { HttpClient } from '../../http/types/HttpClient'
import type { CliOptions } from '../types/CliOptions'
import type { Command } from '../types/Command'

/** `ventanilla-unica dehu list`: the holder's pending and realized DEHU notifications, listing only. */
export const dehuList: Command = {
  portal: 'dehu',
  action: 'list',
  description:
    "List the holder's pending and realized notifications at DEHU without opening any (opening one is the legal act of `dehu comparecer`)",
  options: ['state', 'year'],
  run: async (client: HttpClient, options: CliOptions): Promise<unknown> => {
    const rawState = options['state'] ?? 'pending'
    if (rawState !== 'pending' && rawState !== 'realized' && rawState !== 'all')
      throw new Error('--state must be one of pending, realized, all')
    const rawYear = options['year']
    const year =
      rawYear === undefined ? new Date().getFullYear() : Number(rawYear)
    if (!Number.isInteger(year))
      throw new Error('--year must be a whole year number, e.g. 2026')
    return listNotifications(client, { state: rawState, year })
  },
}
