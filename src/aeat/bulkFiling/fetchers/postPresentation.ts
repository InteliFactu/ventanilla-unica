import type { HttpClient } from '../../../http/types/HttpClient'
import { bulkFilingUrls } from '../bulkFilingUrls'
import type { BulkSignatureDialog } from '../types/BulkSignatureDialog'
import type { TgviAnswer } from '../types/TgviAnswer'
import { postTgvi } from './postTgvi'

/**
 * THE ACT: "Firmar y Enviar" with the firma básica, as the window's
 * presentarAjax does. The authenticated session is the signature; the AEAT
 * registers the return and answers its CSV.
 */
export const postPresentation = async (
  client: HttpClient,
  dialog: BulkSignatureDialog,
): Promise<TgviAnswer> =>
  postTgvi(
    client,
    bulkFilingUrls.present,
    {
      idenvio: dialog.idEnvio,
      firnif: dialog.nif,
      firnombre: dialog.nombre,
      fir: 'FirmaBasica',
    },
    'aceptoCondicionesFirma=SI',
  )
