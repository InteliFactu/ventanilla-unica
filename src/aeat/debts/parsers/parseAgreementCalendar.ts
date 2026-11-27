import type { AgreementInstalment } from '../types/AgreementInstalment'
import { hasCompleteAgreementCalendarTable } from '../validators/hasCompleteAgreementCalendarTable'
import { isAgreementCalendarHeader } from '../validators/isAgreementCalendarHeader'
import { parseAgreementInstalment } from './parseAgreementInstalment'
import { parseTableRowCells } from './parseTableRowCells'
import { stripInactiveAgreementMarkup } from './stripInactiveAgreementMarkup'

/** Require one recognizable calendar and refuse incomplete or partially readable tables. */
export const parseAgreementCalendar = (
  html: string,
): readonly AgreementInstalment[] => {
  const activeHtml = stripInactiveAgreementMarkup(html)
  const parts = activeHtml.split(/(?=<\/?table\b)/i)
  let calendar: readonly AgreementInstalment[] | undefined
  for (const [index, table] of parts.entries()) {
    if (!/^<table\b/i.test(table)) continue
    const [header, ...rows] = parseTableRowCells(table)
    if (!header || !isAgreementCalendarHeader(header)) continue
    if (
      calendar ||
      !hasCompleteAgreementCalendarTable(table, parts[index + 1], rows.length)
    )
      throw new Error('Unexpected AEAT instalment calendar table')
    calendar = rows.map(parseAgreementInstalment)
  }
  if (!calendar) throw new Error('Missing AEAT instalment calendar table')
  return calendar
}
