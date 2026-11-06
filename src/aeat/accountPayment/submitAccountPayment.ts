import type { HtmlForm } from '../../html/types/HtmlForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { postAccountPaymentForm } from './fetchers/postAccountPaymentForm'
import { accountPaymentFinalForm } from './mappers/accountPaymentFinalForm'
import { parsePaymentAlerts } from './parsers/parsePaymentAlerts'
import { parsePaymentNrc } from './parsers/parsePaymentNrc'

/**
 * POST "Firmar y Enviar" and return the NRC. An answer with neither an NRC nor
 * an error, or no answer at all, leaves the payment's fate unknown: the error
 * says so, because retrying blindly could charge twice.
 */
export const submitAccountPayment = async (
  client: HttpClient,
  summary: HtmlForm,
  justificante: string,
): Promise<string> => {
  const unknown =
    'the payment may have been made: check `ventanilla-unica aeat pagos` (or "Consulta de un pago anterior" at the sede) before trying again'
  const html = await postAccountPaymentForm(
    client,
    accountPaymentFinalForm(summary),
  ).catch((error: unknown) => {
    throw new Error(
      `AEAT: "Firmar y Enviar" got no answer (${String(error)}); ${unknown}`,
    )
  })
  const nrc = parsePaymentNrc(html, justificante)
  if (nrc) return nrc
  const alerts = parsePaymentAlerts(html)
  if (alerts.length > 0)
    throw new Error(`AEAT refused the payment: ${alerts.join(' | ')}`)
  throw new Error(
    `AEAT: "Firmar y Enviar" answered no NRC and no error; ${unknown}`,
  )
}
