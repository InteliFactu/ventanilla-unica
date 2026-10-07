import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchPendingNotifications } from './fetchers/fetchPendingNotifications'
import { fetchRealizedNotifications } from './fetchers/fetchRealizedNotifications'
import type { ListQuery } from './types/ListQuery'
import type { Notification } from './types/Notification'
import type { NotificationListing } from './types/NotificationListing'

/**
 * Log in with the holder's certificate and list pending and/or realized DEHU
 * notifications. Read-only: it never opens (compareces) any of them.
 */
export const listNotifications = async (
  client: HttpClient,
  query: ListQuery,
): Promise<NotificationListing> => {
  const { state, year } = query
  if (state !== 'pending' && year === undefined)
    throw new Error('--year is required for state=realized or state=all')
  const authData = await loginWithCertificate(client)
  let notifications: readonly Notification[] = []
  let pages = 0
  if (state === 'pending' || state === 'all') {
    const pending = await fetchPendingNotifications(client, authData)
    notifications = [...notifications, ...pending.notifications]
    pages += pending.pages
  }
  if ((state === 'realized' || state === 'all') && year !== undefined) {
    const realized = await fetchRealizedNotifications(client, authData, year)
    notifications = [...notifications, ...realized.notifications]
    pages += realized.pages
  }
  return { state, notifications, count: notifications.length, pages }
}
