import { X509Certificate } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { AutoScriptAlgorithm } from '../types/AutoScriptAlgorithm'

/** Refuse an algorithm whose key family (RSA, ECDSA) is not the certificate's. */
export const validateKeyType = (
  identity: CertificateIdentity,
  algorithm: AutoScriptAlgorithm,
): void => {
  if (algorithm.keyType === undefined) return
  const actual = new X509Certificate(identity.cert).publicKey.asymmetricKeyType
  if (actual !== algorithm.keyType)
    throw new Error(
      `the portal asks for an ${algorithm.keyType.toUpperCase()} signature, but the certificate key is ${String(actual)}`,
    )
}
