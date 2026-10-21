import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { AutoScriptResult } from '../../../signing/autoscript/types/AutoScriptResult'
import { gobexTimeoutMs } from '../../session/gobexTimeoutMs'

/** Submit the actual qualified signature through the page's success callback. Never retry. */
export const postCarpetaSignature = async (
  client: HttpClient,
  form: HtmlForm,
  signed: AutoScriptResult,
  button: string,
): Promise<HttpResponse> =>
  client.request(form.action, {
    method: 'POST',
    timeoutMs: gobexTimeoutMs,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    referer: form.action,
    form: {
      ...form.fields,
      AJAXREQUEST: '_viewRoot',
      'f_solicitud:firma': signed.signature,
      'f_solicitud:certificadoUsado': signed.certificate,
      [button]: button,
    },
  })
