import { parseForms } from '../../html/parsers/parseForms'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'

/**
 * Press "Descargar el Justificante Electrónico" on the acuse de recibo: post
 * the form that holds that button with the button itself and no other one.
 * Answers the PDF, or undefined when the page has no such button or the
 * answer is not a PDF.
 */
export const fetchJustificante = async (
  client: HttpClient,
  receipt: HttpResponse,
): Promise<Buffer | undefined> => {
  const label = /descargar el justificante/i
  const form = parseForms(receipt.text, receipt.url).find((candidate) =>
    Object.values(candidate.fields).some((value) => label.test(value)),
  )
  if (!form) return undefined
  const fields = Object.fromEntries(
    Object.entries(form.fields).filter(
      ([name, value]) => !name.startsWith('method:') || label.test(value),
    ),
  )
  const answer = await client.request(form.action, {
    method: 'POST',
    referer: receipt.url,
    form: fields,
  })
  return answer.body.subarray(0, 5).toString('latin1') === '%PDF-'
    ? answer.body
    : undefined
}
