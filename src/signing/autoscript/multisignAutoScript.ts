import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signPdfStamped } from '../pades/signPdfStamped'
import { padesOptionsOf } from './mappers/padesOptionsOf'
import { padesTimestampsOf } from './mappers/padesTimestampsOf'
import { multisignAutoScriptCades } from './multisignAutoScriptCades'
import { multisignAutoScriptXades } from './multisignAutoScriptXades'
import type { AutoScriptFamily } from './types/AutoScriptFamily'
import type { AutoScriptMultisigning } from './types/AutoScriptMultisigning'

/**
 * AutoFirma's `coSign` and `counterSign`. CAdES and XAdES do both; a PAdES
 * cosignature is one more signature on the signed PDF, as in AutoFirma, which
 * also refuses to countersign a PDF; FacturaE admits a single signature.
 * shortcut: the `target` parameter is ignored and every top-level signer is
 * countersigned, which is AutoFirma's `leafs` until one is already nested.
 */
export const multisignAutoScript = async (
  identity: CertificateIdentity,
  family: AutoScriptFamily,
  signing: AutoScriptMultisigning,
): Promise<Buffer> => {
  if (signing.data.length === 0)
    throw new Error(`the portal sent no signature to ${signing.operation}`)
  if (family === 'cades') return multisignAutoScriptCades(identity, signing)
  if (family === 'xades') return multisignAutoScriptXades(identity, signing)
  if (family === 'pades' && signing.operation === 'cosign')
    return signPdfStamped(
      identity,
      signing.data,
      {
        ...padesOptionsOf(signing.params, signing.digest),
        ...padesTimestampsOf(signing.params),
      },
      signing.post,
    )
  throw new Error(`${signing.operation} is not supported for ${signing.format}`)
}
