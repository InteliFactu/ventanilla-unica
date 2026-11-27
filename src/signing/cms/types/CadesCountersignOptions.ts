import type { CountersignTarget } from '../../types/CountersignTarget'
import type { DigestName } from '../../types/DigestName'

/** The knobs of a CAdES countersignature; each has a documented default. */
export type CadesCountersignOptions = {
  /** Default: now. */
  readonly signingTime?: Date | undefined
  /** Default SHA-256. */
  readonly digest?: DigestName | undefined
  /** Omit to countersign the top-level signers. */
  readonly target?: CountersignTarget | undefined
}
