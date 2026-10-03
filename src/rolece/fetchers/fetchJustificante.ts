import { encodeLatin1Form } from '../../http/encodeLatin1Form'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { selectFormByName } from '../../sepe/certificates/selectors/selectFormByName'

/**
 * Press "Descargar el Justificante Electrónico" on the acuse de recibo. The
 * `descargarJustificante` form carries the registry's signed proof itself
 * (`campoXML`, `campoXMLDescarga`), so the post is self-contained; it is
 * sent in ISO-8859-1 like the page, with that button and no other (the
 * commented-out Imprimir input is not part of the form). The portal answers
 * a ZIP: the signed proof XML and the stylesheets that render it. Answers
 * undefined when the page has no such form or the answer is not a ZIP.
 */
export const fetchJustificante = async (
  client: HttpClient,
  receipt: HttpResponse,
): Promise<Buffer | undefined> => {
  const button = 'method:descargaJustificante'
  const html = receipt.text.replaceAll(/<!--[\s\S]*?-->/g, '')
  const form = selectFormByName(html, 'descargarJustificante', receipt.url)
  const label = form?.fields[button]
  if (!form || label === undefined) return undefined
  const fields = Object.fromEntries(
    Object.entries(form.fields).filter(
      ([name]) => !name.startsWith('method:') || name === button,
    ),
  )
  const answer = await client.request(form.action, {
    method: 'POST',
    referer: receipt.url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeLatin1Form(fields),
  })
  return answer.body.subarray(0, 2).toString('latin1') === 'PK'
    ? answer.body
    : undefined
}
