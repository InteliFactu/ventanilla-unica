import { htmlToText } from '../../html/htmlToText'
import type { HttpResponse } from '../../http/types/HttpResponse'

/**
 * What the signed post answered: the acuse de recibo of the application
 * (with the expediente number when the page names one), or anything else,
 * which the caller keeps for a human to read and never retries.
 */
export const readFilingAnswer = (
  page: HttpResponse,
): {
  readonly filed: boolean
  readonly expediente: string | undefined
  readonly summary: string
} => {
  const summaryLength = 600
  const text = htmlToText(
    page.text.replace(/^[\s\S]*?<div id="content"/i, '<div'),
  )
  const filed =
    page.status === 200 &&
    /acuse de recibo|justificante/i.test(text) &&
    !/pendiente de ser firmada/i.test(text)
  const expediente =
    /expediente[^A-Z0-9]{0,40}((?=[A-Z0-9/-]*\d)[A-Z0-9][A-Z0-9/-]{3,})/i.exec(
      text,
    )?.[1]
  return { filed, expediente, summary: text.slice(0, summaryLength) }
}
