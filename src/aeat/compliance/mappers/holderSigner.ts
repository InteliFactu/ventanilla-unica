import { parseSignatureIdentity } from '../../appearance/parsers/parseSignatureIdentity'
import type { EmceSigner } from '../../census/types/EmceSigner'

/**
 * Sign the "firma básica" with the NIF and name the confirmation page
 * pre-fills (`_fbNif`, `_fbNombre`), after checking that the certificate
 * acts for `--nif`: the request is always "en nombre propio", and a
 * certificate for another holder would emit theirs instead.
 */
export const holderSigner =
  (nif: string): EmceSigner =>
  (confirmationHtml) => {
    const identity = parseSignatureIdentity(confirmationHtml)
    if (identity.nif.toUpperCase() !== nif.toUpperCase())
      throw new Error(
        `AEAT: the certificate acts for ${identity.nif}, not for --nif ${nif}; requests for a third party are not supported`,
      )
    return identity
  }
