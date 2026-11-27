import { asRecord } from '../../api/asRecord'
import { toNotification } from '../mappers/toNotification'
import type { Notification } from '../types/Notification'
import { notificationApiItems } from './notificationApiItems'

/** Map one page of the pending-notifications API response to notifications, all in the `pending` state. */
export const parsePendingNotificationPage = (
  json: unknown,
): readonly Notification[] => {
  const rawItems = asRecord(json)?.['items']
  if (!Array.isArray(rawItems))
    throw new Error('DEHU: pending notification response has no items array')
  const items = notificationApiItems(json)
  if (items.length !== rawItems.length)
    throw new Error('DEHU: pending response contains an invalid notification')
  return items.map((item) =>
    toNotification(item, { state: 'pending', expiresAt: item.expirationDate }),
  )
}
