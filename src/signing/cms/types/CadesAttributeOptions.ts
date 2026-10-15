import type { DigestName } from '../../types/DigestName'
import type { CmsSignaturePolicy } from './CmsSignaturePolicy'

/** What a CAdES signature's signed attributes depend on beyond the content. */
export type CadesAttributeOptions = {
  readonly signingTime: Date
  readonly digest: DigestName
  /** CAdES-EPES policy; absent means CAdES-BES. */
  readonly policy?: CmsSignaturePolicy | undefined
}
