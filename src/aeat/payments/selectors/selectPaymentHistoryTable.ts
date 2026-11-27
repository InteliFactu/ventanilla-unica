import { normalizePaymentHistoryHeaderRow } from '../parsers/normalizePaymentHistoryHeaderRow'
import { readPaymentHistoryHeader } from '../parsers/readPaymentHistoryHeader'
import { isPaymentHistoryHeader } from '../validators/isPaymentHistoryHeader'

/** An authenticated layout can also carry an error. Require the actual MisPagos table. */
export const selectPaymentHistoryTable = (html: string): string | undefined => {
  const fragments = html.split(/(?=<\/?table\b)/i)
  let found: string | undefined
  for (const [index, fragment] of fragments.entries()) {
    if (!/^<table\b/i.test(fragment)) continue
    if (!isPaymentHistoryHeader(readPaymentHistoryHeader(fragment))) continue
    if (found !== undefined)
      throw new Error(
        'AEAT: MisPagos history has multiple matching tables; debit blocked',
      )
    const closing = /^<\/table\s*>/i.exec(fragments[index + 1] ?? '')?.[0]
    if (!closing)
      throw new Error(
        'AEAT: MisPagos history has incomplete table markup; debit blocked',
      )
    found = normalizePaymentHistoryHeaderRow(fragment + closing)
  }
  return found
}
