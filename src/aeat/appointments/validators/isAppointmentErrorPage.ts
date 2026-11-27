import { htmlToText } from '../../../html/htmlToText'

/**
 * The portal's "Gestion de errores" page. Observed answering HTTP 299, and
 * answering the `procedimiento` step for a holder who already had a booking.
 */
export const isAppointmentErrorPage = (html: string): boolean => {
  const title = /<title\b[^>]*>([^<]*)<\/title>/i.exec(html)?.[1] ?? ''
  return (
    /^Gesti[oó]n de errores$/i.test(htmlToText(title)) &&
    htmlToText(html).includes('Se ha producido un error interno en el Sistema')
  )
}
