import type { DebtReportTotal } from '../types/DebtReportTotal'
import { parseEuroAmount } from './parseEuroAmount'

/** The report's stated total ("importe total de 2.129,26 euros"), as shown and in euros. */
export const parseDebtReportTotal = (
  text: string,
): DebtReportTotal | undefined => {
  const amount = /importe total de (\d[\d.]*,\d{2}) euros/.exec(text)?.[1]
  if (!amount) return undefined
  return { totalExigible: amount, totalExigibleEuros: parseEuroAmount(amount) }
}
