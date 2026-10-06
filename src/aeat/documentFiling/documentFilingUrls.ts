import { aeatBaseUrl } from '../session/aeatBaseUrl'

/**
 * The AEAT registry for documentation tied to a CSV ("Presentación de
 * documentación relacionada con un documento recibido de la AEAT"). The
 * public page posts to www2, which bounces a certificate holder to the access
 * selector; the same paths on www1 take the client certificate directly.
 */
export const documentFilingUrls = {
  csvForm: `${aeatBaseUrl}/wlpl/REGD-JDIT/FGCSV`,
  attach: `${aeatBaseUrl}/wlpl/REGD-JDIT/FGGraba`,
  form: `${aeatBaseUrl}/wlpl/REGD-JDIT/FG`,
  upload: `${aeatBaseUrl}/wlpl/EECA-FICH/UploadSv`,
  uploadDialog: `${aeatBaseUrl}/wlpl/EECA-FICH/DialogoSubida`,
} as const
