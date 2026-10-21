import { unescapeHtml } from '../../../html/unescapeHtml'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { mergeCarpetaFragment } from '../parsers/mergeCarpetaFragment'
import { readCarpetaForm } from '../parsers/readCarpetaForm'

/** Submit one observed JSF/A4J step; preserve the updated view and follow its declared redirect. */
export const postCarpetaStep = async (
  client: HttpClient,
  page: HttpResponse,
  id: string,
  overrides: Readonly<Record<string, string>>,
): Promise<HttpResponse> => {
  const form = readCarpetaForm(page.text, page.url, id)
  const answer = await client.request(form.action, {
    method: 'POST',
    form: { ...form.fields, AJAXREQUEST: '_viewRoot', ...overrides },
    referer: form.action,
    timeoutMs: 180_000,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  })
  const redirect = /<meta name="Location" content="([^"]+)"/.exec(
    answer.text,
  )?.[1]
  if (redirect)
    return client.request(
      new URL(unescapeHtml(redirect), answer.url).href.replace(
        'http:',
        'https:',
      ),
    )
  if (
    /Debe(?:&nbsp;|\s)+introducir|Error Bloque|no se ha podido/i.test(
      answer.text,
    )
  )
    throw new Error(
      'Junta: the form rejected this step; inspect the saved draft before retrying',
    )
  return { ...answer, text: mergeCarpetaFragment(page.text, answer.text) }
}
