import { htmlToText } from '../../../html/htmlToText'
import type { AeatExpediente } from '../types/AeatExpediente'

/** Parse one five-column row, ignoring the table header. */
export const parseExpedienteRow = (row: string): AeatExpediente | undefined => {
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(
    (match) => match[1] ?? '',
  )
  if (cells.length !== 5) return undefined
  const [period, procedure, status, lastActionDate, referenceCell] = cells as [
    string,
    string,
    string,
    string,
    string,
  ]
  const link =
    /<a[^>]*href=['"]([^'"]*\/TEWV-CORE\/DetalleVlt\?evt=[^'"]+)['"][^>]*>([\s\S]*?)<\/a>/i.exec(
      referenceCell,
    )
  if (!link) throw new Error('AEAT: expediente row has no detail link')
  return {
    period: htmlToText(period),
    procedure: htmlToText(procedure),
    status: htmlToText(status),
    lastActionDate: htmlToText(lastActionDate),
    startDate: null,
    endDate: null,
    reference: htmlToText(link[2] ?? ''),
    detailUrl: link[1] ?? '',
    acts: [],
  }
}
