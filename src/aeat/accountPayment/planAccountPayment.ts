import type { AccountPaymentContext } from './types/AccountPaymentContext'
import type { AccountPaymentOutcome } from './types/AccountPaymentOutcome'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'
import { accountPaymentBlockers } from './validators/accountPaymentBlockers'

/** The steps a confirmed payment would run, with what blocks or qualifies it. */
export const planAccountPayment = (
  context: AccountPaymentContext,
  request: AccountPaymentRequest,
): AccountPaymentOutcome => {
  const blockers = accountPaymentBlockers(context, request)
  const plan = [
    'When a separate taxpayer certificate is used, check its MisPagos history before transmitting the payment form. A prior payment or unverifiable history stops the attempt.',
    'GET OVPP-PAGO/LiquidacionesCuenta and POST its first step: the AEAT validates modelo, justificante, importe and IBAN and shows the summary. Nothing is charged.',
    `POST "Firmar y Enviar": the AEAT orders the bank to debit ${request.importe} EUR from ${request.iban} for modelo ${request.modelo} justificante ${request.justificante} and returns the NRC. The debt is then paid; this cannot be undone.`,
    'The certificate holder must be the holder of the account (or hold a power to order debits on it).',
    request.outDir
      ? 'GET OVPP-PAGO/ImpresionPDF: save the payment receipt.'
      : 'Without --out the receipt PDF is not downloaded.',
  ]
  return {
    plan,
    notes: blockers,
    ready: blockers.length === 0,
  }
}
