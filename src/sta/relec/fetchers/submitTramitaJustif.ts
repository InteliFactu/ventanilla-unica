import { encodeLatin1Form } from '../../../http/encodeLatin1Form'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { RelecSignPage } from '../types/RelecSignPage'

/**
 * Register the filing: `POST /sta/Relec/TramitaJustif` with the signing
 * page's own form (`xmlFirmar` empty: the signature already went through
 * `FileUploaderApplet`). This is the legal act.
 */
export const submitTramitaJustif = async (
  client: HttpClient,
  page: RelecSignPage,
  referer: string,
): Promise<HttpResponse> => {
  const response = await client.request(page.justif.action, {
    method: 'POST',
    body: encodeLatin1Form({ ...page.justif.fields, xmlFirmar: '' }),
    referer,
    defaultCharset: 'iso-8859-1',
    timeoutMs: 300_000,
  })
  if (response.status !== 200)
    throw new Error(
      `TramitaJustif answered ${String(response.status)}; check \`caceres registros\` before filing again`,
    )
  return response
}
