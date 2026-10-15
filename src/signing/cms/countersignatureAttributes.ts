import { derOctetString } from '../asn1/derOctetString'
import { derUtcTime } from '../asn1/derUtcTime'
import type { CertificateParts } from '../asn1/types/CertificateParts'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { signingCertificateV2Attribute } from './signingCertificateV2Attribute'
import type { CadesAttributeOptions } from './types/CadesAttributeOptions'

/**
 * The signed attributes of a CAdES countersignature: messageDigest over the
 * countersigned signature value, signingCertificateV2 and signingTime. No
 * contentType, which RFC 5652 section 11.4 forbids in a countersignature.
 */
export const countersignatureAttributes = (
  signatureDigest: Buffer,
  signer: CertificateParts,
  options: CadesAttributeOptions,
): readonly Buffer[] => [
  cmsAttribute(cmsOids.messageDigest, [derOctetString(signatureDigest)]),
  signingCertificateV2Attribute(signer, options.digest),
  cmsAttribute(cmsOids.signingTime, [derUtcTime(options.signingTime)]),
]
