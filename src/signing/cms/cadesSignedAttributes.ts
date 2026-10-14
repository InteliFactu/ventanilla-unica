import { derUtcTime } from '../asn1/derUtcTime'
import type { CertificateParts } from '../asn1/types/CertificateParts'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { signedAttributes } from './signedAttributes'

/**
 * The signed attributes of a CAdES-B-B signature: the PAdES set plus
 * signingTime, which ETSI EN 319 122-1 requires in CAdES and AutoFirma always
 * adds (`CAdESParameters`, clienteafirma 0d7f3cf).
 */
export const cadesSignedAttributes = (
  contentDigest: Buffer,
  signer: CertificateParts,
  signingTime: Date,
): readonly Buffer[] => [
  ...signedAttributes(contentDigest, signer),
  cmsAttribute(cmsOids.signingTime, [derUtcTime(signingTime)]),
]
