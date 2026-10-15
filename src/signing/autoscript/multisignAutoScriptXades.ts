import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { cosignXadesSignature } from '../xades/cosignXadesSignature'
import { countersignXadesSignature } from '../xades/countersignXadesSignature'
import { xadesOptionsOf } from './mappers/xadesOptionsOf'
import type { AutoScriptMultisigning } from './types/AutoScriptMultisigning'

/** XAdES `coSign` or `counterSign` with the same AutoFirma defaults as a first signature; where it goes follows the existing one. */
export const multisignAutoScriptXades = (
  identity: CertificateIdentity,
  signing: AutoScriptMultisigning,
): Buffer => {
  const {
    mode: _mode,
    detachedUri: _uri,
    signedNodeId: _node,
    ...options
  } = xadesOptionsOf(signing.format, signing.params, signing.digest)
  return signing.operation === 'countersign'
    ? countersignXadesSignature(identity, signing.data, options)
    : cosignXadesSignature(identity, signing.data, options)
}
