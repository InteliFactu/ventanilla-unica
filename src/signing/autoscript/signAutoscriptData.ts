import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signData } from '../signData'
import { parseAutoScriptAlgorithm } from './parsers/parseAutoScriptAlgorithm'
import { validateKeyType } from './validators/validateKeyType'

/**
 * AutoScript's `NONE` format, as AutoFirma performs it: a raw signature (RSA
 * PKCS#1 v1.5, or DER ECDSA for an EC key) with the requested digest over the
 * bytes the portal sent base64, returned base64. The TGSS "firma optimizada"
 * asks for it with `SHA256withRSA` (`FIRMAAUTOSCRIPT`).
 */
export const signAutoscriptData = (
  identity: CertificateIdentity,
  dataBase64: string,
  algorithm: string,
): string => {
  const parsed = parseAutoScriptAlgorithm(algorithm)
  validateKeyType(identity, parsed)
  const data = Buffer.from(dataBase64, 'base64')
  if (data.length === 0) throw new Error('the portal sent no data to sign')
  return signData(identity, data, parsed.digest).toString('base64')
}
