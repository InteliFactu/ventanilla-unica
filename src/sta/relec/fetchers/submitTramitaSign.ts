import { encodeLatin1Pairs } from '../../../http/encodeLatin1Pairs'
import type { FormPair } from '../../../http/types/FormPair'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'

/**
 * "Continuar": `POST /sta/Relec/TramitaSign` with the whole form, encoded
 * ISO-8859-1 like the page. The sede answers the "FIRMA DE SOLICITUD"
 * summary; nothing is registered yet.
 */
export const submitTramitaSign = async (
  client: HttpClient,
  formUrl: string,
  pairs: readonly FormPair[],
): Promise<HttpResponse> => {
  const response = await client.request(
    new URL('TramitaSign', formUrl).toString(),
    {
      method: 'POST',
      body: encodeLatin1Pairs(pairs),
      referer: formUrl,
      defaultCharset: 'iso-8859-1',
      timeoutMs: 180_000,
    },
  )
  if (response.status !== 200)
    throw new Error(`TramitaSign answered ${String(response.status)}`)
  return response
}
