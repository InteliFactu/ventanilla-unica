import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { justiciaUrls } from './justiciaUrls'
import type { VisorSession } from './types/VisorSession'

/** One `AjaxResolver?tipo=accesoExternoEje` call; the visor answers HTTP 902 to a body it rejects. */
export const postVisorAjax = async (
  client: HttpClient,
  session: VisorSession,
  form: Readonly<Record<string, string>>,
): Promise<HttpResponse> => {
  const response = await client.request(justiciaUrls.visorAjax, {
    method: 'POST',
    referer: session.url,
    headers: {
      'X-CSRF-TOKEN': session.csrf,
      'X-Requested-With': 'XMLHttpRequest',
    },
    form: { execution: session.execution, ...form },
  })
  if (response.status !== 200)
    throw new Error(
      `Justicia: the visor answered ${String(response.status)} to ${form['codOpe'] ?? 'a call'}`,
    )
  return response
}
