import type { CmsSignaturePolicy } from '../../cms/types/CmsSignaturePolicy'
import type { DigestName } from '../../types/DigestName'

/** How `signPdf` presents the signature. */
export type SignPdfOptions = {
  /** Draw a "Firmado por <CN>" stamp on page 1; invisible by default. */
  readonly visible?: boolean | undefined
  readonly reason?: string | undefined
  readonly location?: string | undefined
  /** The signing time; now by default. */
  readonly date?: Date | undefined
  /** Digest of the byte ranges and of the CMS signature; SHA-256 by default. */
  readonly digest?: DigestName | undefined
  /** PAdES-EPES policy (signature-policy-identifier attribute); none by default. */
  readonly policy?: CmsSignaturePolicy | undefined
}
