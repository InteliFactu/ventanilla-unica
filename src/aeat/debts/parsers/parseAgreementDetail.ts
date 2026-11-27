import { htmlToText } from '../../../html/htmlToText'
import { toMoneyAmount } from '../../money/mappers/toMoneyAmount'
import type { AgreementDetail } from '../types/AgreementDetail'
import { parseTableRowCells } from './parseTableRowCells'
import { stripInactiveAgreementMarkup } from './stripInactiveAgreementMarkup'

/**
 * Fields read from one AcuAccDeta page. Notes only pin down a handful of
 * labels, so every liquidation key mentioned is collected separately. The
 * legacy table cells can describe debts; the linked calendar is read separately.
 */
export const parseAgreementDetail = (html: string): AgreementDetail => {
  const activeHtml = stripInactiveAgreementMarkup(html)
  const text = htmlToText(activeHtml)
  const isDefined = (value: string | undefined): value is string =>
    value !== undefined
  const importeText =
    /Importe acuerdo[\s:]*(-?\d{1,3}(?:\.\d{3})*,\d{2})/i.exec(text)?.[1]
  const deudas = [
    ...new Set(
      [...text.matchAll(/\b(A\d{16}[A-Z0-9]?|Z\d{18,20})\b/g)].map(
        (match) => match[1],
      ),
    ),
  ].filter(isDefined)
  return {
    estado: /Acuerdo[\s:]*\w+\s*\(([^)]+)\)/i.exec(text)?.[1],
    resolucion: /Tipo resoluci[^\s:]+[\s:]*(Concesi\S+|Denegaci\S+)/i.exec(
      text,
    )?.[1],
    importe: importeText ? toMoneyAmount(importeText) : undefined,
    notificado: /Fecha notificaci[^\s:]+[\s:]*(\d{2}-\d{2}-\d{4})/i.exec(
      text,
    )?.[1],
    plazos: /N\S+mero de? plazos[\s:]*(\d+)/i.exec(text)?.[1],
    primerPlazo: /Fecha primer plazo[\s:]*(\d{2}-\d{2}-\d{4})/i.exec(text)?.[1],
    deudas,
    instalments: parseTableRowCells(activeHtml).filter((cells) =>
      cells.some((cell) => cell !== ''),
    ),
  }
}
