import { isEuroAmountText } from '../../paymentLetter/validators/isEuroAmountText'
import { isPaymentHistoryReference } from './isPaymentHistoryReference'

/** Verify the fields of a real MisPagos row before trusting a negative result. */
export const isVerifiablePaymentHistoryRow = (
  row: readonly string[],
): boolean => {
  if (row.length !== 7) return false
  const [type, model, reference, amount, bank, date] = row as readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
  return (
    /^(?:liquidaci[oó]n|autoliquid(?:\.|aci[oó]n)|tasa)$/i.test(type) &&
    /^\d{3}(?:\s*\/\s*\d{4}\s*\/\s*[\dA-Z]{1,2})?$/i.test(model) &&
    isPaymentHistoryReference(type, reference) &&
    isEuroAmountText(amount.replace(/[\s€\u0080]+$/, '')) &&
    /^\d{4}$/.test(bank) &&
    /^(?:0[1-9]|[12]\d|3[01])\/(?:0[1-9]|1[0-2])\/\d{4}$/.test(date)
  )
}
