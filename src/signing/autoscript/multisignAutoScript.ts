import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { cosignCadesSignedData } from '../cms/cosignCadesSignedData'
import { countersignCadesSignedData } from '../cms/countersignCadesSignedData'
import type { DigestName } from '../types/DigestName'
import { cmsPolicyOf } from './mappers/cmsPolicyOf'
import { parseExtraParams } from './parsers/parseExtraParams'
import type { AutoScriptFamily } from './types/AutoScriptFamily'
import type { AutoScriptRequest } from './types/AutoScriptRequest'

/**
 * AutoFirma's `coSign` and `counterSign` for CAdES: add a signer over the
 * same content, or countersign each signer's signature value. shortcut: the
 * `target` parameter is ignored and every top-level signer is countersigned,
 * which is AutoFirma's `leafs` until a countersignature is already nested;
 * XAdES and PAdES multisignatures are refused until a sede needs them.
 */
export const multisignAutoScript = (
  identity: CertificateIdentity,
  family: AutoScriptFamily,
  request: AutoScriptRequest,
  digest: DigestName,
): Buffer => {
  const operation = request.operation ?? 'sign'
  if (family !== 'cades')
    throw new Error(`${operation} is only supported for CAdES`)
  const signature = Buffer.from(request.signature ?? '', 'base64')
  if (signature.length === 0)
    throw new Error(`the portal sent no signature to ${operation}`)
  if (operation === 'countersign')
    return countersignCadesSignedData(identity, signature, { digest })
  const content = Buffer.from(request.data, 'base64')
  return cosignCadesSignedData(identity, signature, {
    digest,
    content: content.length > 0 ? content : undefined,
    policy: cmsPolicyOf(parseExtraParams(request.extraParams)),
  })
}
