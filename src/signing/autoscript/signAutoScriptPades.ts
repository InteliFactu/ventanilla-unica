import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signPdf } from '../pades/signPdf'
import type { DigestName } from '../types/DigestName'
import { cmsPolicyOf } from './mappers/cmsPolicyOf'
import type { ExtraParams } from './types/ExtraParams'

/**
 * An AutoScript PAdES signature, as the signed PDF: invisible, ETSI.CAdES.detached
 * (another `signatureSubFilter` is refused), with `signReason` and
 * `signatureProductionCity` as /Reason and /Location.
 */
export const signAutoScriptPades = (
  identity: CertificateIdentity,
  data: Buffer,
  params: ExtraParams,
  digest: DigestName,
): Buffer => {
  const subFilter = params.get('signatureSubFilter')
  if (subFilter !== undefined && subFilter !== 'ETSI.CAdES.detached')
    throw new Error(`unsupported signatureSubFilter: ${subFilter}`)
  return signPdf(identity, data, {
    digest,
    policy: cmsPolicyOf(params),
    reason: params.get('signReason'),
    location: params.get('signatureProductionCity'),
  })
}
