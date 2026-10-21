import { unescapeHtml } from '../../../html/unescapeHtml'

/** Surface a registration error without echoing the private form or assuming a 200 means success. */
export const readCarpetaFilingError = (html: string): string | undefined =>
  /Código:\s*\d+\. Error:[^<]+/.exec(unescapeHtml(html))?.[0]
