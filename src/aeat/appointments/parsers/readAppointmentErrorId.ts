import { htmlToText } from '../../../html/htmlToText'

/** The incident number as displayed on the appointment error page. */
export const readAppointmentErrorId = (html: string): string | undefined =>
  /Identificaci[oó]n del error\s*:\s*(\d+)/iu.exec(htmlToText(html))?.[1]
