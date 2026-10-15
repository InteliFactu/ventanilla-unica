import { createHash } from 'node:crypto'

import { derNode } from '../asn1/derNode'
import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import type { CertificateParts } from '../asn1/types/CertificateParts'
import type { DigestName } from '../types/DigestName'
import { cmsAttribute } from './cmsAttribute'
import { cmsDigestOids } from './cmsDigestOids'
import { cmsOids } from './cmsOids'

/**
 * signingCertificateV2 (RFC 5035): SEQUENCE { certs SEQUENCE OF ESSCertIDv2 },
 * ESSCertIDv2 ::= SEQUENCE { hashAlgorithm (omitted when SHA-256, the
 * default), certHash, issuerSerial SEQUENCE { GeneralNames { [4]
 * directoryName }, serial } }.
 */
export const signingCertificateV2Attribute = (
  parts: CertificateParts,
  digest: DigestName,
): Buffer => {
  const directoryNameTag = 4
  const certHash = createHash(digest).update(parts.der).digest()
  const issuerSerial = derSequence([
    derSequence([derNode(0xa0 + directoryNameTag, parts.issuer)]),
    parts.serialNumber,
  ])
  const hashAlgorithm =
    digest === 'sha256' ? [] : [derSequence([derOid(cmsDigestOids[digest])])]
  const essCertId = derSequence([
    ...hashAlgorithm,
    derOctetString(certHash),
    issuerSerial,
  ])
  const value = derSequence([derSequence([essCertId])])
  return cmsAttribute(cmsOids.signingCertificateV2, [value])
}
