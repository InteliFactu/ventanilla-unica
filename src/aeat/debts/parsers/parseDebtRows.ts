import { toMoneyAmount } from '../../money/mappers/toMoneyAmount'
import type { DebtPeriodAndSituation } from '../types/DebtPeriodAndSituation'
import type { DebtRow } from '../types/DebtRow'
import { parseTableRowCells } from './parseTableRowCells'

/**
 * Every debt row of the 'Relación de deudas' table, deduplicated by clave (the
 * page repeats the list for a desktop table and a mobile block).
 */
export const parseDebtRows = (html: string): readonly DebtRow[] => {
  const claveKeyPattern =
    /^[A-Z]\d{6}[A-Z0-9]*$|^\d{4}[A-Z]{3}\d{3}[A-Z]\d+[A-Z]$/
  const amountCellPattern = /^-?\d+(?:\.\d{3})*,\d{2}$/
  const periodoStartPattern = /^(?:volunt|ejecut)/i
  const findPeriodoAndSituacion = (
    cells: readonly string[],
  ): DebtPeriodAndSituation => {
    const index = cells.findIndex((cell) => periodoStartPattern.test(cell))
    return {
      periodoRecaudacion: index >= 0 ? cells[index] : undefined,
      situacion: index >= 0 ? cells[index + 1] : undefined,
    }
  }
  const seen = new Set<string>()
  const rows: DebtRow[] = []
  for (const cells of parseTableRowCells(html)) {
    const nonEmpty = cells.filter((cell) => cell !== '')
    const clave = nonEmpty[0]
    if (!clave || !claveKeyPattern.test(clave) || seen.has(clave)) continue
    const rest = nonEmpty.slice(2)
    const amounts = rest.filter((cell) => amountCellPattern.test(cell))
    const pendienteText = amounts[0]
    if (!pendienteText) continue
    seen.add(clave)
    const aIngresarText = amounts[1]
    const { periodoRecaudacion, situacion } = findPeriodoAndSituacion(rest)
    rows.push({
      clave,
      concepto: nonEmpty[1] ?? '',
      pendiente: toMoneyAmount(pendienteText),
      aIngresar: aIngresarText ? toMoneyAmount(aIngresarText) : undefined,
      periodoRecaudacion,
      situacion,
    })
  }
  return rows
}
