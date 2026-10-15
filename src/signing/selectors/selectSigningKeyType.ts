import type { X509Certificate } from 'node:crypto'

import type { SigningKeyType } from '../types/SigningKeyType'

/** The certificate's key family, refusing one the signers here cannot use. */
export const selectSigningKeyType = (
  certificate: X509Certificate,
): SigningKeyType => {
  const type = certificate.publicKey.asymmetricKeyType
  if (type === 'rsa' || type === 'ec') return type
  throw new Error(`unsupported certificate key type: ${String(type)}`)
}
