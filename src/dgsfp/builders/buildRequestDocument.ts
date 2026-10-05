import type { DgsfpDrawText } from '../types/DgsfpDrawText'
import type { DgsfpFormValues } from '../types/DgsfpFormValues'
import type { DgsfpPdfTexts } from '../types/DgsfpPdfTexts'
import { assembleTextPdf } from '../writers/assembleTextPdf'
import { layoutSummaryPages } from '../writers/layoutSummaryPages'
import { pageContentStream } from '../writers/pageContentStream'
import { buildSummaryLines } from './buildSummaryLines'

/**
 * The request document ("documento de solicitud") the holder signs: the page
 * draws it in the browser with react-pdf from the form values, the sede's
 * header and footer texts and the HMAC; this draws the same content as plain
 * text pages (no coat of arms), every page with its header, footer and number.
 */
export const buildRequestDocument = (
  values: DgsfpFormValues,
  texts: DgsfpPdfTexts,
): Buffer => {
  const pages = layoutSummaryPages(buildSummaryLines(values, texts.hmac))
  const frame = (index: number): readonly DgsfpDrawText[] => [
    { x: 50, y: 800, size: 9, bold: true, text: texts.titleHeader },
    {
      x: 50,
      y: 788,
      size: 9,
      bold: false,
      text: 'Dirección General de Seguros y Fondos de Pensiones',
    },
    { x: 50, y: 24, size: 7, bold: true, text: texts.footer },
    { x: 50, y: 14, size: 7, bold: false, text: texts.footAddress },
    {
      x: 480,
      y: 14,
      size: 7,
      bold: false,
      text: `Página ${String(index + 1)} / ${String(pages.length)}`,
    },
  ]
  return assembleTextPdf(
    pages.map((runs, index) => pageContentStream([...frame(index), ...runs])),
  )
}
