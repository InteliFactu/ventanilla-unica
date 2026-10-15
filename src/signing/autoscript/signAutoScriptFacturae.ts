import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { DigestName } from '../types/DigestName'
import { facturaeProfile } from '../xades/facturaeProfile'
import { signXml } from '../xades/signXml'
import type { ExtraParams } from './types/ExtraParams'

/**
 * An AutoScript FacturaE signature: AutoFirma's Facturae profile, always
 * enveloped, claiming `emisor` unless `signerClaimedRoles` (`|` separated)
 * says otherwise.
 */
export const signAutoScriptFacturae = (
  identity: CertificateIdentity,
  data: Buffer,
  params: ExtraParams,
  digest: DigestName,
): Buffer => {
  const roles = params.get('signerClaimedRoles')
  return signXml(identity, data, {
    ...facturaeProfile,
    mode: 'enveloped',
    signatureDigest: digest,
    ...(roles === undefined ? {} : { signerRoles: roles.split('|') }),
  }).xml
}
