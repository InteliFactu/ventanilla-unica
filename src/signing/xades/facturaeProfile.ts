import { facturaePolicy } from './facturaePolicy'
import type { SignXmlOptions } from './types/SignXmlOptions'

/**
 * What AutoFirma's `-format facturae` emits beyond plain XAdES-EPES, read from
 * a signature FACe accepted (2026-09-16) and from `AOFacturaESigner`
 * (clienteafirma 0d7f3cf): the Facturae 3.1 policy, the `emisor` role, the
 * enveloped transform alone, the RSA key value, SHA-512 references and the
 * text/xml ObjectIdentifier. The signature itself stays RSA-SHA256.
 */
export const facturaeProfile: Omit<SignXmlOptions, 'mode'> = {
  policy: facturaePolicy,
  signerRoles: ['emisor'],
  contentC14nTransform: false,
  keyInfo: { keyValue: true },
  referencesDigest: 'sha512',
  objectIdentifier: 'urn:oid:1.2.840.10003.5.109.10',
}
