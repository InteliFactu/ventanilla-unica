import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { cosignCadesSignedData } from '../cms/cosignCadesSignedData'
import { countersignCadesSignedData } from '../cms/countersignCadesSignedData'
import { cmsPolicyOf } from './mappers/cmsPolicyOf'
import type { AutoScriptMultisigning } from './types/AutoScriptMultisigning'

/** CAdES `coSign` (a signer over the same content) or `counterSign` (every signer's signature value). */
export const multisignAutoScriptCades = (
  identity: CertificateIdentity,
  signing: AutoScriptMultisigning,
): Buffer => {
  const { data, content, digest } = signing
  if (signing.operation === 'countersign')
    return countersignCadesSignedData(identity, data, { digest })
  return cosignCadesSignedData(identity, data, {
    digest,
    content: content.length > 0 ? content : undefined,
    policy: cmsPolicyOf(signing.params),
  })
}
