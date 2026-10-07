import { htmlToText } from '../../html/htmlToText'
import type { HttpResponse } from '../../http/types/HttpResponse'
import type { FilingAnswer } from '../types/FilingAnswer'

/**
 * What the signed post answered: the acuse de recibo of the application,
 * with its "Número de Registro" and "Número de Expediente", or anything
 * else, which the caller keeps for a human to read and never retries.
 */
export const readFilingAnswer = (page: HttpResponse): FilingAnswer => {
  const summaryLength = 600
  const text = htmlToText(
    page.text.replace(/^[\s\S]*?<div id="content"/i, '<div'),
  )
  const registro = /n[úu]mero de registro\s*:\s*(\S+)/i.exec(text)?.[1]
  const expediente = /n[úu]mero de expediente\s*:\s*(\S+)/i.exec(text)?.[1]
  const filed =
    page.status === 200 &&
    /acuse de recibo/i.test(text) &&
    registro !== undefined
  return { filed, registro, expediente, summary: text.slice(0, summaryLength) }
}
