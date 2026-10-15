import type { DigestName } from '../../types/DigestName'
import type { CmsSignaturePolicy } from './CmsSignaturePolicy'

/** The digest and, when EPES, the policy of a detached PAdES CMS. */
export type DetachedSignedDataOptions = {
  readonly digest: DigestName
  readonly policy?: CmsSignaturePolicy | undefined
}
