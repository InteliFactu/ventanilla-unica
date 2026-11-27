import type { HttpClient } from '../../http/types/HttpClient'
import { parseTableRowCells } from '../debts/parsers/parseTableRowCells'
import { fetchPaymentsPage } from '../payments/fetchers/fetchPaymentsPage'
import { parseHolderName } from '../payments/parsers/parseHolderName'
import { parsePaymentRows } from '../payments/parsers/parsePaymentRows'
import { stripInertPaymentMarkup } from '../payments/parsers/stripInertPaymentMarkup'
import { selectPaymentHistoryTable } from '../payments/selectors/selectPaymentHistoryTable'
import { hasCompletePaymentHistoryMarkup } from '../payments/validators/hasCompletePaymentHistoryMarkup'
import { isVerifiablePaymentHistoryRow } from './validators/isVerifiablePaymentHistoryRow'

/** Read a verified payment history before deciding that a document can be debited. */
export const findPaidNrc = async (
  client: HttpClient,
  justificante: string,
): Promise<string | undefined> => {
  const html = stripInertPaymentMarkup(await fetchPaymentsPage(client))
  const table = selectPaymentHistoryTable(html)
  if (!parseHolderName(html) || table === undefined)
    throw new Error(
      'AEAT: MisPagos printed no payment history page; debit blocked',
    )
  if (!hasCompletePaymentHistoryMarkup(table))
    throw new Error(
      'AEAT: MisPagos history has incomplete table markup; debit blocked',
    )
  const rows = parseTableRowCells(table).slice(1)
  if (rows.length === 0 || !rows.every(isVerifiablePaymentHistoryRow))
    throw new Error(
      'AEAT: MisPagos did not establish whether the payment already exists; debit blocked',
    )
  const reference = justificante.toUpperCase()
  const payment = parsePaymentRows(table).find(
    (row) =>
      row.nrc.toUpperCase().startsWith(reference) ||
      row.justificante.toUpperCase() === reference,
  )
  if (payment) return payment.nrc
  if (rows.some((row) => row[2]?.toUpperCase() === reference))
    throw new Error(
      `AEAT: MisPagos lists justificante ${justificante} without an NRC; debit blocked`,
    )
  return undefined
}
