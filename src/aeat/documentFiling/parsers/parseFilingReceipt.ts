import { htmlToText } from '../../../html/htmlToText'
import type { DocumentFilingReceipt } from '../types/DocumentFilingReceipt'

/**
 * Step 3, "Recibo de presentación". The receipt's layout was not captured
 * before the first real filing, so every value is read leniently and the page
 * itself is kept by the caller.
 */
export const parseFilingReceipt = (html: string): DocumentFilingReceipt => {
  const text = htmlToText(html)
  const csv =
    /CSV=([A-Z0-9]{16})/.exec(html)?.[1] ??
    /(?:C[oó]digo Seguro de Verificaci[oó]n|CSV)\W+([A-Z0-9]{16})\b/.exec(
      text,
    )?.[1]
  const registro =
    /(?:N[uú]mero de (?:registro|entrada)|Registro)\W+([A-Z0-9-]{8,})/i.exec(
      text,
    )?.[1]
  const fecha =
    /(\d{2}[-/]\d{2}[-/]\d{4}(?: a las \d{2}:\d{2}(?::\d{2})?)?)/.exec(
      text,
    )?.[1]
  return { csv, registro, fecha }
}
