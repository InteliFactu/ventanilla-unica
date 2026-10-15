import type { DigestName } from '../../types/DigestName'
import type { CmsSignaturePolicy } from './CmsSignaturePolicy'

/** The knobs of a CAdES signature; each has a documented default. */
export type CadesSignedDataOptions = {
  /** Carry the content (`implicit`, the default) or only sign it (`explicit`). */
  readonly mode?: 'implicit' | 'explicit' | undefined
  /** Default: now. */
  readonly signingTime?: Date | undefined
  /** Default SHA-256. */
  readonly digest?: DigestName | undefined
  /** CAdES-EPES policy; absent means CAdES-BES. */
  readonly policy?: CmsSignaturePolicy | undefined
}
