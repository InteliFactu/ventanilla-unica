import type { CertificateParts } from '../../asn1/types/CertificateParts'
import type { DigestName } from '../../types/DigestName'
import type { SigningKeyType } from '../../types/SigningKeyType'

/** What one SignerInfo is made of. */
export type SignerInfoParts = {
  readonly signer: CertificateParts
  /** The signer's key family, which names the signature algorithm. */
  readonly keyType: SigningKeyType
  /** Digest of the content and of the signed attributes. */
  readonly digest: DigestName
  /** The signed attributes, each an encoded Attribute. */
  readonly attributes: readonly Buffer[]
  /** RSA PKCS#1 v1.5 or DER ECDSA signature, with `digest`, over the attributes' DER SET OF encoding. */
  readonly signature: Buffer
}
