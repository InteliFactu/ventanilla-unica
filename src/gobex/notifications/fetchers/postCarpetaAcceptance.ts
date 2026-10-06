import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { gobexTimeoutMs } from '../../session/gobexTimeoutMs'
import { selectAcceptButton } from '../selectors/selectAcceptButton'
import { selectFormWithInput } from '../selectors/selectFormWithInput'

/**
 * Accept a pending notification from its `firmarAcuseRecibo.jsf` screen: the
 * A4J submit of the confirmation panel's "Aceptar" button with every field
 * of its form. No client signature is involved; the sede signs the acuse
 * itself and answers "El documento se ha firmado correctamente". Any other
 * answer is a failure: the act may or may not have happened, so the caller
 * must look at the list before trying again.
 */
export const postCarpetaAcceptance = async (
  client: HttpClient,
  detail: HttpResponse,
): Promise<void> => {
  const button = selectAcceptButton(detail.text)
  const form = button
    ? selectFormWithInput(detail.text, detail.url, button)
    : undefined
  if (!button || !form)
    throw new Error(
      `Junta: no acceptance button at ${detail.url}; the notification screen is not the one this command knows`,
    )
  const answer = await client.request(form.action, {
    timeoutMs: gobexTimeoutMs,
    method: 'POST',
    form: { ...form.fields, AJAXREQUEST: '_viewRoot', [button]: button },
    referer: detail.url,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  })
  if (!answer.text.includes('El documento se ha firmado correctamente'))
    throw new Error(
      `Junta: the sede did not confirm the acceptance (status ${String(answer.status)}); check junta carpeta-notificaciones before trying again`,
    )
}
