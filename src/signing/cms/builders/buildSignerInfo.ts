import { X509Certificate } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { derSetOf } from '../../asn1/derSetOf'
import { readCertificateParts } from '../../asn1/parsers/readCertificateParts'
import type { CertificateParts } from '../../asn1/types/CertificateParts'
import { selectSigningKeyType } from '../../selectors/selectSigningKeyType'
import { signData } from '../../signData'
import type { DigestName } from '../../types/DigestName'
import { selectSignerCertificates } from '../selectors/selectSignerCertificates'
import { signerInfo } from '../signerInfo'

/** One signed SignerInfo for the holder, over the attributes `attributesOf` builds for their certificate. */
export const buildSignerInfo = (
  identity: CertificateIdentity,
  digest: DigestName,
  attributesOf: (signer: CertificateParts) => readonly Buffer[],
): Buffer => {
  const certificate = selectSignerCertificates(identity).signer
  const signer = readCertificateParts(certificate)
  const attributes = attributesOf(signer)
  return signerInfo({
    signer,
    keyType: selectSigningKeyType(new X509Certificate(certificate)),
    digest,
    attributes,
    signature: signData(identity, derSetOf(attributes), digest),
  })
}
