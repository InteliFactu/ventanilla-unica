import { htmlToText } from '../../../html/htmlToText'

/** Surface a registration error without echoing the private form or assuming a 200 means success. */
export const readCarpetaFilingError = (html: string): string | undefined =>
  /Código:\s*\d+\. Error:.+/
    .exec(htmlToText(html))?.[0]
    .split(' Valore ')[0]
    ?.split(' Mensaje ')[0]
