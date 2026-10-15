import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { dgtAjaxHeaders } from '../../session/dgtAjaxHeaders'
import { dgtUrls } from '../../session/dgtUrls'

/** GET one Mi DGT counter (`ajaxCalls.jsp?<name>=true`) as the home page loads it. */
export const fetchMiDgtCounter = async (
  client: HttpClient,
  name: string,
): Promise<HttpResponse> =>
  client.request(`${dgtUrls.miDgtCounters}?${name}=true`, {
    headers: dgtAjaxHeaders,
    referer: dgtUrls.miDgtHome,
  })
