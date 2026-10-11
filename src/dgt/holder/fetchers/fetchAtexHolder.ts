import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { dgtAjaxHeaders } from '../../session/dgtAjaxHeaders'
import { dgtUrls } from '../../session/dgtUrls'

/** POST the ATEX lookup the address-change service runs: identity and notification address, without vehicles. */
export const fetchAtexHolder = async (
  client: HttpClient,
  nif: string,
): Promise<HttpResponse> =>
  client.request(dgtUrls.atex, {
    method: 'POST',
    form: { nifTitular: nif, vehiculos: 'false', numVehiculosGF: '20' },
    headers: dgtAjaxHeaders,
    referer: dgtUrls.subscriptionsPage,
  })
