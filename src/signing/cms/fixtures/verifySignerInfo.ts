import { createHash, verify, X509Certificate } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { derOctetString } from '../../asn1/derOctetString'
import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { DigestName } from '../../types/DigestName'

/**
 * Whether one encoded SignerInfo is the holder's valid signature over
 * `signed`: its messageDigest attribute is the digest of `signed` and its
 * signature verifies over the attributes re-tagged as a SET.
 */
export const verifySignerInfo = (
  signerInfo: Buffer,
  identity: CertificateIdentity,
  signed: Buffer,
  digest: DigestName = 'sha256',
): boolean => {
  const fields = readDerChildren(signerInfo, readDerElement(signerInfo, 0))
  const attributes = fields.find((field) => field.tag === 0xa0)
  const signature = fields.find((field) => field.tag === 0x04)
  if (!attributes || !signature) return false
  const set = Buffer.from(signerInfo.subarray(attributes.start, attributes.end))
  set[0] = 0x31
  const expected = derOctetString(createHash(digest).update(signed).digest())
  return (
    set.includes(expected) &&
    verify(
      digest,
      set,
      new X509Certificate(identity.cert).publicKey,
      signerInfo.subarray(signature.valueStart, signature.end),
    )
  )
}
