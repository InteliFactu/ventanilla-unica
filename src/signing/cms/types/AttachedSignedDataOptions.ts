import type { DigestName } from '../../types/DigestName'
import type { CmsSignaturePolicy } from './CmsSignaturePolicy'

/** The knobs of an attached CAdES signature; each has a documented default. */
export type AttachedSignedDataOptions = {
  /** Default: now. */
  readonly signingTime?: Date | undefined
  /** Default SHA-256. */
  readonly digest?: DigestName | undefined
  /** CAdES-EPES policy; absent means CAdES-BES. */
  readonly policy?: CmsSignaturePolicy | undefined
}
