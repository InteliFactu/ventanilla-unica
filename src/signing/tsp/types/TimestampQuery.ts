import type { DigestName } from '../../types/DigestName'

/** What one RFC 3161 TimeStampReq asks for, kept to check the reply against. */
export type TimestampQuery = {
  readonly digest: DigestName
  /** The hashed message, `digest` of the data being timestamped. */
  readonly imprint: Buffer
  readonly policy: string | undefined
  /** Random positive nonce bytes the reply must echo. */
  readonly nonce: Buffer
}
