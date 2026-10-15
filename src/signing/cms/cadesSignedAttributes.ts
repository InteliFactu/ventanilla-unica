import { derUtcTime } from '../asn1/derUtcTime'
import type { CertificateParts } from '../asn1/types/CertificateParts'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { signaturePolicyAttribute } from './signaturePolicyAttribute'
import { signedAttributes } from './signedAttributes'
import type { CadesAttributeOptions } from './types/CadesAttributeOptions'

/**
 * The signed attributes of a CAdES-B-B signature: the PAdES set plus
 * signingTime, which ETSI EN 319 122-1 requires in CAdES and AutoFirma always
 * adds (`CAdESParameters`, clienteafirma 0d7f3cf), and the policy when EPES.
 */
export const cadesSignedAttributes = (
  contentDigest: Buffer,
  signer: CertificateParts,
  options: CadesAttributeOptions,
): readonly Buffer[] => [
  ...signedAttributes(contentDigest, signer, options.digest),
  cmsAttribute(cmsOids.signingTime, [derUtcTime(options.signingTime)]),
  ...(options.policy === undefined
    ? []
    : [signaturePolicyAttribute(options.policy)]),
]
