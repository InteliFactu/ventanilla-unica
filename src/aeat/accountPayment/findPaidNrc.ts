import type { HttpClient } from '../../http/types/HttpClient'
import { fetchPaymentsPage } from '../payments/fetchers/fetchPaymentsPage'
import { parsePaymentRows } from '../payments/parsers/parsePaymentRows'

/** The NRC MisPagos lists for a justificante (every NRC starts with it), if it is already paid. */
export const findPaidNrc = async (
  client: HttpClient,
  justificante: string,
): Promise<string | undefined> =>
  parsePaymentRows(await fetchPaymentsPage(client)).find((row) =>
    row.nrc.startsWith(justificante),
  )?.nrc
