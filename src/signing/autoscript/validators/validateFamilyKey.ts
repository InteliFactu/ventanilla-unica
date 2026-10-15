import { X509Certificate } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { AutoScriptFamily } from '../types/AutoScriptFamily'

/** Refuse an EC certificate for anything but `NONE`: the CMS, XAdES and PAdES signers here are RSA only. */
export const validateFamilyKey = (
  identity: CertificateIdentity,
  family: AutoScriptFamily,
): void => {
  const keyType = new X509Certificate(identity.cert).publicKey.asymmetricKeyType
  if (family !== 'none' && keyType !== 'rsa')
    throw new Error(
      `only RSA certificates can sign ${family.toUpperCase()} here (the certificate key is ${String(keyType)})`,
    )
}
