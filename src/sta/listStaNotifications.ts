import type { HttpClient } from '../http/types/HttpClient'
import { fetchStaPage } from './fetchers/fetchStaPage'
import { fetchStaTab } from './fetchers/fetchStaTab'
import { notificationsFromDatasets } from './mappers/notificationsFromDatasets'
import { openStaSession } from './session/openStaSession'
import { staOrigins } from './session/staOrigins'
import type { StaNotificationsListing } from './types/StaNotificationsListing'
import type { StaPortal } from './types/StaPortal'

/**
 * The holder's notifications at an STA sede: pending, accepted and rejected,
 * as interested party and as representative. Only the listings are read;
 * opening a pending notification counts as accepting it, so none is opened.
 */
export const listStaNotifications = async (
  client: HttpClient,
  portal: StaPortal,
): Promise<StaNotificationsListing> => {
  const origin = staOrigins[portal]
  await openStaSession(client, origin)
  const notifications = notificationsFromDatasets(
    await fetchStaPage(client, origin, 'SINGLE_NOTIF'),
  )
  for (const tabber of ['TABBER', 'REP_TABBER'])
    for (const tab of ['ACEPTADA', 'RECHAZADA'])
      notifications.push(
        ...notificationsFromDatasets(
          await fetchStaTab(client, origin, {
            pageCode: 'SINGLE_NOTIF',
            screenId: 'NOTIFICACIONES',
            tabber,
            tab,
          }),
        ),
      )
  return {
    host: new URL(origin).hostname,
    pending: notifications.filter((item) => item.tab === 'pendiente').length,
    notifications,
  }
}
