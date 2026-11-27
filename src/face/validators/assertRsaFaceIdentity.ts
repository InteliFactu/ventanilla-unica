import { createPrivateKey } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { parseCertificateChain } from '../../signing/xades/parsers/parseCertificateChain'

/** Require the matching RSA signer used by the evidenced FACe profile. */
export const assertRsaFaceIdentity = (identity: CertificateIdentity): void => {
  const { signer } = parseCertificateChain(identity.cert)
  if (signer.publicKey.asymmetricKeyType !== 'rsa') {
    throw new Error('FACe preparation needs an RSA certificate')
  }
  const key = createPrivateKey({
    key: identity.key,
    passphrase: identity.passphrase,
  })
  if (!signer.checkPrivateKey(key)) {
    throw new Error('The FACe private key does not match its certificate')
  }
}
