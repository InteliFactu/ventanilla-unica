import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { performAccountPayment } from './performAccountPayment'
import { planAccountPayment } from './planAccountPayment'
import { readAccountPaymentContext } from './readAccountPaymentContext'
import type { AccountPaymentPlan } from './types/AccountPaymentPlan'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'

/**
 * `aeat pagar`: validate the payment with the AEAT up to its summary page and
 * plan; only with `confirm` press "Firmar y Enviar", which debits the account
 * and pays the debt.
 */
export const payByAccountDebit = async (
  client: HttpClient,
  request: AccountPaymentRequest,
): Promise<AccountPaymentPlan> => {
  await openAeatSession(client)
  const context = await readAccountPaymentContext(client, request)
  const { plan, notes, ready } = planAccountPayment(context, request)
  const action = `pay AEAT modelo ${request.modelo} justificante ${request.justificante} (${request.importe} EUR) by debit to ${request.iban}`
  const titular = context.summary?.fields['idape']
  if (!request.confirm || !ready || !context.summary)
    return { action, executed: false, plan, notes, titular }
  const receipt = await performAccountPayment(client, request, context.summary)
  const pdfNote =
    request.outDir && !receipt.pdfPath
      ? [
          `The receipt PDF could not be downloaded; \`ventanilla-unica aeat pagos --out\` fetches it later (NRC ${receipt.nrc}).`,
        ]
      : []
  return {
    action,
    executed: true,
    plan,
    receipt,
    notes: [...notes, ...pdfNote],
    titular,
  }
}
