import type { HttpClient } from '../../../http/types/HttpClient'
import { documentFilingUrls } from '../documentFilingUrls'
import type { AeatPage } from '../types/AeatPage'
import type { SignatureScreen } from '../types/SignatureScreen'
import { postRegistryForm } from './postRegistryForm'

/**
 * THE ACT: what "Firmar Enviar" submits after the firma básica dialog's
 * "Conforme". `MiniDialogoFirma.js` signs nothing locally: it fills FIRNIF,
 * FIRNOMBRE and FIR=FirmaBasica and submits the step-2 form; the
 * certificate-authenticated session is the signature. From this answer on the
 * documents are registered as filed today.
 */
export const postFilingSignature = async (
  client: HttpClient,
  screen: SignatureScreen,
): Promise<AeatPage> =>
  postRegistryForm(
    client,
    documentFilingUrls.form,
    {
      ...screen.fields,
      FIRNIF: screen.signer.nif,
      FIRNOMBRE: screen.signer.nombre,
      FIR: 'FirmaBasica',
    },
    screen.page.url,
  )
