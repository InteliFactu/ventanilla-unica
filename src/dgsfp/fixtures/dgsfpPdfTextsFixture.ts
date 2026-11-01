import type { DgsfpPdfTexts } from '../types/DgsfpPdfTexts'

/** Synthetic header, footer and HMAC texts for the request document. */
export const dgsfpPdfTextsFixture: DgsfpPdfTexts = {
  titleHeader: 'Sede electrónica DGSFP',
  footer: 'Pie del documento',
  footAddress: 'Paseo de la Castellana 44',
  hmac: 'HMAC-0123456789',
}
