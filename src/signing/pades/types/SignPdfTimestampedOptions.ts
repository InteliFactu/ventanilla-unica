import type { TimestampAuthority } from '../../tsp/types/TimestampAuthority'
import type { SignPdfOptions } from './SignPdfOptions'

/** `signPdf` options plus the TSA that stamps the signature. */
export type SignPdfTimestampedOptions = SignPdfOptions & {
  readonly timestamp: TimestampAuthority
}
