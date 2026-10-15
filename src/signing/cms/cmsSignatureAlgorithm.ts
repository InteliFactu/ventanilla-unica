import { derNull } from '../asn1/derNull'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import type { DigestName } from '../types/DigestName'
import type { SigningKeyType } from '../types/SigningKeyType'
import { cmsEcdsaOids } from './cmsEcdsaOids'
import { cmsOids } from './cmsOids'

/**
 * The SignerInfo signatureAlgorithm: rsaEncryption with NULL parameters, as
 * AutoFirma writes it, or ecdsa-with-SHA* without parameters (RFC 5758).
 */
export const cmsSignatureAlgorithm = (
  keyType: SigningKeyType,
  digest: DigestName,
): Buffer =>
  keyType === 'ec'
    ? derSequence([derOid(cmsEcdsaOids[digest])])
    : derSequence([derOid(cmsOids.rsaEncryption), derNull()])
