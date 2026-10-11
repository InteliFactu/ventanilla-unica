import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { dgtUrls } from '../../session/dgtUrls'

/** POST "Mis datos de contacto y suscripciones" (the form's action is `#?update=true`: the page itself). */
export const submitSubscription = async (
  client: HttpClient,
  fields: Readonly<Record<string, string>>,
): Promise<HttpResponse> =>
  client.request(dgtUrls.subscriptionsPage, {
    method: 'POST',
    form: fields,
    referer: dgtUrls.subscriptionsPage,
    headers: { Origin: dgtUrls.origin },
  })
