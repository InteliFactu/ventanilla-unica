import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { registradoresHeaders } from '../../session/registradoresHeaders'
import { siteUrl } from '../../session/siteUrl'

/** One form step of the `site` application, posted with the session's `_csrf`. */
export const postNotaStep = async (
  client: HttpClient,
  path: string,
  csrf: string,
  fields: Readonly<Record<string, string>>,
): Promise<HttpResponse> =>
  client.request(siteUrl(path), {
    method: 'POST',
    form: { _csrf: csrf, ...fields },
    headers: registradoresHeaders,
  })
