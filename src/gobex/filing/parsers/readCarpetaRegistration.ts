import { htmlToText } from '../../../html/htmlToText'

/** A receipt number is required; generic success strings in hidden modals are not evidence. */
export const readCarpetaRegistration = (html: string): string | undefined =>
  /Su petición ha sido registrada con nº\s+(\d{16})/.exec(htmlToText(html))?.[1]
