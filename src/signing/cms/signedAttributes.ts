import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import type { CertificateParts } from '../asn1/types/CertificateParts'
import type { DigestName } from '../types/DigestName'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { signingCertificateV2Attribute } from './signingCertificateV2Attribute'

/**
 * The signed attributes of a PAdES-B-B signature: contentType, messageDigest
 * and signingCertificateV2. No signingTime: ETSI EN 319 142-1 forbids it in
 * PAdES, whose signing time is the /M entry of the signature dictionary.
 */
export const signedAttributes = (
  contentDigest: Buffer,
  signer: CertificateParts,
  digest: DigestName,
): readonly Buffer[] => [
  cmsAttribute(cmsOids.contentType, [derOid(cmsOids.data)]),
  cmsAttribute(cmsOids.messageDigest, [derOctetString(contentDigest)]),
  signingCertificateV2Attribute(signer, digest),
]
