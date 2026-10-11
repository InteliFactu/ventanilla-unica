import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { dgtAjaxHeaders } from '../../session/dgtAjaxHeaders'
import { dgtUrls } from '../../session/dgtUrls'

/** GET the holder's contact data (SAVI subscription) as the subscriptions page loads it. */
export const fetchSaviContact = async (
  client: HttpClient,
): Promise<HttpResponse> =>
  client.request(dgtUrls.saviSubscription, {
    headers: dgtAjaxHeaders,
    referer: dgtUrls.subscriptionsPage,
  })
