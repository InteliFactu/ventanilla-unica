import { parseTableRowCells } from '../../debts/parsers/parseTableRowCells'
import { paymentFromCells } from '../mappers/paymentFromCells'
import type { AeatPayment } from '../types/AeatPayment'

/**
 * The payment rows of the MisPagos table. A row is a payment when it carries
 * the six data cells and a Descargar link, whose `nrc=` query is the only
 * place the full receipt reference is printed. Rows are deduped by NRC.
 */
export const parsePaymentRows = (html: string): readonly AeatPayment[] => {
  const dataCells = 6
  const seen = new Set<string>()
  const payments: AeatPayment[] = []
  for (const [row = ''] of html.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr\s*>/gi)) {
    const nrc = /[?&]nrc=(\w+)/.exec(row)?.[1]
    const cells = parseTableRowCells(row)[0] ?? []
    if (!nrc || seen.has(nrc) || cells.length < dataCells) continue
    seen.add(nrc)
    payments.push(paymentFromCells(cells, nrc))
  }
  return payments
}
