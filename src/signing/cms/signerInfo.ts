import { derInteger } from '../asn1/derInteger'
import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { cmsDigestOids } from './cmsDigestOids'
import { cmsSignatureAlgorithm } from './cmsSignatureAlgorithm'
import type { SignerInfoParts } from './types/SignerInfoParts'

/**
 * SignerInfo ::= SEQUENCE { version 1, sid IssuerAndSerialNumber,
 * digestAlgorithm, signedAttrs [0] IMPLICIT, signatureAlgorithm
 * (rsaEncryption or ecdsa-with-SHA*), signature }.
 */
export const signerInfo = (parts: SignerInfoParts): Buffer =>
  derSequence([
    derInteger(1),
    derSequence([parts.signer.issuer, parts.signer.serialNumber]),
    derSequence([derOid(cmsDigestOids[parts.digest])]),
    derSetOf(parts.attributes, 0xa0),
    cmsSignatureAlgorithm(parts.keyType, parts.digest),
    derOctetString(parts.signature),
  ])
