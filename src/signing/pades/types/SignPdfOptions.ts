import type { CmsSignaturePolicy } from '../../cms/types/CmsSignaturePolicy'
import type { DigestName } from '../../types/DigestName'
import type { PdfSubFilter } from './PdfSubFilter'

/** How `signPdf` presents the signature. */
export type SignPdfOptions = {
  /** Draw a stamp ("Firmado por <CN>" unless `text` says otherwise); invisible by default. */
  readonly visible?: boolean | undefined
  readonly reason?: string | undefined
  readonly location?: string | undefined
  readonly contactInfo?: string | undefined
  /** The signing time; now by default. */
  readonly date?: Date | undefined
  /** Digest of the byte ranges and of the CMS signature; SHA-256 by default. */
  readonly digest?: DigestName | undefined
  /** PAdES-EPES policy (signature-policy-identifier attribute); none by default. */
  readonly policy?: CmsSignaturePolicy | undefined
  /** ETSI.CAdES.detached by default; a policy requires it. */
  readonly subFilter?: PdfSubFilter | undefined
  /** 1-based page of the new field, negative from the end; 1 by default. */
  readonly page?: number | undefined
  /** The stamp's [llx lly urx ury] in points; [36 36 336 86] by default. */
  readonly rect?: readonly number[] | undefined
  /** The stamp's text, AutoFirma `layer2Text` style (`$$SUBJECTCN$$`, `$$SIGNDATE=dd/MM/yyyy$$`, ...). */
  readonly text?: string | undefined
  /** Sign the existing empty signature field with this name instead of adding one. */
  readonly field?: string | undefined
}
