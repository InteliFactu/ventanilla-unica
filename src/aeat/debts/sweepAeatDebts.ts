import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { parseEntityName } from '../session/parseEntityName'
import { fetchAgreements } from './fetchers/fetchAgreements'
import { fetchDebtDetail } from './fetchers/fetchDebtDetail'
import { fetchDebtList } from './fetchers/fetchDebtList'
import { buildDebt } from './mappers/buildDebt'
import { sumDebtTotals } from './mappers/sumDebtTotals'
import { parseDebtDetail } from './parsers/parseDebtDetail'
import { parseDebtRows } from './parsers/parseDebtRows'
import { parseNoDebtsHint } from './parsers/parseNoDebtsHint'
import type { AeatDebtReport } from './types/AeatDebtReport'
import type { Debt } from './types/Debt'

/**
 * Read-only AEAT debt sweep for one NIF: open the session, read the pending
 * debts with their detail, and read every SRAF deferral agreement. SRAF
 * lists only the certificate holder's agreements whatever NIF is asked
 * (checked 2026-11-18), so callers skip them for another NIF.
 */
export const sweepAeatDebts = async (
  client: HttpClient,
  nif: string,
  withAgreements = true,
): Promise<AeatDebtReport> => {
  await openAeatSession(client)
  const listHtml = await fetchDebtList(client, nif)
  const rows = parseDebtRows(listHtml)
  const entity = parseEntityName(listHtml)
  const hint = rows.length === 0 ? parseNoDebtsHint(listHtml) : undefined
  // The identification form and error pages can show the holder's name.
  if (rows.length === 0 && hint === undefined)
    throw new Error('AEAT: unexpected page instead of the debt list')
  const debts: Debt[] = []
  for (const row of rows) {
    const detailHtml = await fetchDebtDetail(client, nif, row.clave)
    debts.push(buildDebt(row, parseDebtDetail(detailHtml)))
  }
  const agreements = withAgreements ? await fetchAgreements(client) : []
  return {
    nif,
    entity,
    debts,
    agreements,
    agreementsNote: withAgreements
      ? undefined
      : 'SRAF agreements not read: SRAF lists only the certificate holder’s, not those of this NIF',
    totals: sumDebtTotals(debts),
    hint,
  }
}
