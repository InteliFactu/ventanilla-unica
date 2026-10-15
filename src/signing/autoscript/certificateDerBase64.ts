import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'

/**
 * The holder's certificate as the base64 DER the AutoScript `selectCertificate`
 * callback hands back: only the body of the first CERTIFICATE block. Anything
 * around it ("Bag Attributes" from a PKCS#12 export) makes the portal's
 * FIRMA_PREPARARXML_AUTOFIRMA answer 500 and drop the session.
 */
export const certificateDerBase64 = (identity: CertificateIdentity): string => {
  const pem = identity.cert.toString('utf8')
  const match =
    /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/.exec(pem)
  if (match?.[1] === undefined)
    throw new Error('the certificate carries no PEM CERTIFICATE block')
  const body = match[1].replaceAll(/\s+/g, '')
  if (body.length === 0) throw new Error('the CERTIFICATE block is empty')
  return body
}
