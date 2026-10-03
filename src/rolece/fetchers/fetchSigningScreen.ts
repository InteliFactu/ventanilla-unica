import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'

/**
 * Press "Firmar y Enviar Solicitud": post the simplified application form.
 * The portal answers the draft to sign ("pendiente de ser firmada") and files
 * nothing; the manual says it can still be corrected with Volver. Filing
 * happens only when the signed document is posted back.
 */
export const fetchSigningScreen = async (
  client: HttpClient,
  action: string,
  fields: Readonly<Record<string, string>>,
): Promise<HttpResponse> =>
  client.request(action, { method: 'POST', referer: action, form: fields })
