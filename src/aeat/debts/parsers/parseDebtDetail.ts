import { htmlToText } from '../../../html/htmlToText'
import { toMoneyAmount } from '../../money/mappers/toMoneyAmount'
import type { DebtDetail } from '../types/DebtDetail'
import { parseVoluntaryDeadline } from './parseVoluntaryDeadline'

/**
 * Read one DetalleDda page. `DetalleDda` answers 200 with no 'Datos generales'
 * block for a clave it no longer resolves, which carries zero information and
 * is reported as undefined rather than as zeroed amounts.
 */
export const parseDebtDetail = (html: string): DebtDetail | undefined => {
  const text = htmlToText(html)
  if (!text.includes('Datos generales')) return undefined
  const fechaLimiteVoluntaria = parseVoluntaryDeadline(html)
  const grabAmount = (
    pattern: RegExp,
  ): ReturnType<typeof toMoneyAmount> | undefined => {
    const value = pattern.exec(text)?.[1]
    return value ? toMoneyAmount(value) : undefined
  }
  return {
    fechaLiquidacion:
      /Fecha de liquidaci[^\s:]+[\s:]*(\d{2}-\d{2}-\d{4})/i.exec(text)?.[1],
    ...(fechaLimiteVoluntaria ? { fechaLimiteVoluntaria } : {}),
    importeDeuda: grabAmount(
      /Importe de la deuda[\s:]*(-?\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ),
    cancelado: grabAmount(
      /Total importes cancelados[\s:]*(-?\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ),
    principalHoy: grabAmount(
      /Importe deuda a ingresar[\s:]*(-?\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ),
    interesesHoy: grabAmount(/Intereses[\s:]*(-?\d{1,3}(?:\.\d{3})*,\d{2})/i),
    totalHoy: grabAmount(
      /Total a ingresar[\s:]*(-?\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ),
  }
}
