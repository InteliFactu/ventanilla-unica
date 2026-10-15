import type { X509Certificate } from 'node:crypto'
import { verify } from 'node:crypto'

import type { DigestName } from '../../types/DigestName'

/** Fail when the key that signed (RSA, or r||s ECDSA) does not belong to the certificate the signature names. */
export const assertSignatureVerifies = (
  certificate: X509Certificate,
  data: Buffer,
  signature: Buffer,
  digest: DigestName,
): void => {
  const key = { key: certificate.publicKey, dsaEncoding: 'ieee-p1363' } as const
  if (!verify(digest, data, key, signature))
    throw new Error('the private key does not match the signing certificate')
}
