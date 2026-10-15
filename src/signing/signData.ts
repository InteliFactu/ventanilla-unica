import { createPrivateKey, sign } from 'node:crypto'

import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { DigestName } from './types/DigestName'

/**
 * Sign `data` with the holder's key and the given digest: RSA PKCS#1 v1.5 for
 * an RSA key, ECDSA for an EC key (DER for CMS and X.509, `ieee-p1363` r||s
 * for XML-DSig). The primitive every signature format
 * here ends in (CMS, XAdES, the TGSS "firma optimizada" of a server-prepared
 * hash).
 */
export const signData = (
  identity: CertificateIdentity,
  data: Buffer,
  digest: DigestName,
  ecdsaEncoding: 'der' | 'ieee-p1363' = 'der',
): Buffer => {
  const key = createPrivateKey({
    key: identity.key,
    ...(identity.passphrase === undefined
      ? {}
      : { passphrase: identity.passphrase }),
  })
  return sign(digest, data, { key, dsaEncoding: ecdsaEncoding })
}
