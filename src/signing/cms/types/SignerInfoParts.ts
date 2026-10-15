import type { CertificateParts } from '../../asn1/types/CertificateParts'
import type { DigestName } from '../../types/DigestName'

/** What one SignerInfo is made of. */
export type SignerInfoParts = {
  readonly signer: CertificateParts
  /** Digest of the content and of the signed attributes. */
  readonly digest: DigestName
  /** The signed attributes, each an encoded Attribute. */
  readonly attributes: readonly Buffer[]
  /** RSA PKCS#1 v1.5 signature, with `digest`, over the attributes' DER SET OF encoding. */
  readonly signature: Buffer
}
