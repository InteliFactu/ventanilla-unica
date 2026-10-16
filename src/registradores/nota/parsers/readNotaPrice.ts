import { htmlToText } from '../../../html/htmlToText'

/** The amount of the pago page's summary ("Concepto Cantidad/Coste ... 3,58 €"), before tax. */
export const readNotaPrice = (html: string): string | undefined => {
  const text = htmlToText(html)
  const summary = text.slice(Math.max(0, text.indexOf('Cantidad/Coste')))
  return /\d{1,6},\d{2} €/.exec(summary)?.[0]
}
