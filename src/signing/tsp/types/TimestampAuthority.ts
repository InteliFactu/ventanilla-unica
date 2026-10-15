import type { DigestName } from '../../types/DigestName'

/** Where and how to ask for an RFC 3161 timestamp, AutoFirma's `tsaURL`, `tsaPolicy` and `tsaHashAlgorithm`. */
export type TimestampAuthority = {
  readonly url: string
  /** The TSA policy OID to request; the TSA's default when absent. */
  readonly policy?: string | undefined
  /** Digest of the imprint; SHA-512 by default, as AutoFirma. */
  readonly digest?: DigestName | undefined
}
