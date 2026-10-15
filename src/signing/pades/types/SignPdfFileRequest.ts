import type { TimestampAuthority } from '../../tsp/types/TimestampAuthority'
import type { SignPdfOptions } from './SignPdfOptions'

/** Sign the PDF at `input` into `output`. */
export type SignPdfFileRequest = {
  readonly input: string
  readonly output: string
  readonly options: SignPdfOptions
  /** The TSA that stamps the signature (PAdES-B-T); none by default. */
  readonly timestamp?: TimestampAuthority | undefined
  /** The TSA that stamps the document before it is signed (/DocTimeStamp); none by default. */
  readonly documentTimestamp?: TimestampAuthority | undefined
}
