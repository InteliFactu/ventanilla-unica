import type { DigestName } from '../../types/DigestName'

/** The knobs of a CAdES countersignature; each has a documented default. */
export type CadesCountersignOptions = {
  /** Default: now. */
  readonly signingTime?: Date | undefined
  /** Default SHA-256. */
  readonly digest?: DigestName | undefined
}
