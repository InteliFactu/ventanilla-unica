import { ibanEntityCode } from '../mappers/ibanEntityCode'
import type { AccountPaymentContext } from '../types/AccountPaymentContext'
import type { AccountPaymentRequest } from '../types/AccountPaymentRequest'
import { summaryMismatches } from './summaryMismatches'

/** Every reason the confirmed run would stop; empty means it may press "Firmar y Enviar". */
export const accountPaymentBlockers = (
  context: AccountPaymentContext,
  request: AccountPaymentRequest,
): readonly string[] => {
  const code = ibanEntityCode(request.iban)
  const entity = context.entities.some((row) => row.codigo === code)
    ? []
    : [
        `Entity ${code} of the IBAN is not adhered to AEAT payment by account debit (VerEntidadesAdheridas).`,
      ]
  const alerts = context.alerts.map((alert) => `AEAT: ${alert}`)
  const summary = context.summary
    ? summaryMismatches(context.summary, request)
    : alerts.length > 0
      ? []
      : ['The first step answered neither the summary page nor an error.']
  const paid = context.paidNrc
    ? [
        `MisPagos already lists NRC ${context.paidNrc} for justificante ${request.justificante}: it is paid. The form does not refuse a paid justificante, so a second payment would be charged.`,
      ]
    : []
  return [...entity, ...alerts, ...summary, ...paid]
}
