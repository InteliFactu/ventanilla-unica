import type { X509Certificate } from 'node:crypto'
import { verify } from 'node:crypto'

import type { DigestName } from '../../types/DigestName'

/** Fail when the key that signed does not belong to the certificate the signature names. */
export const assertSignatureVerifies = (
  certificate: X509Certificate,
  data: Buffer,
  signature: Buffer,
  digest: DigestName,
): void => {
  if (!verify(digest, data, certificate.publicKey, signature))
    throw new Error('the private key does not match the signing certificate')
}
