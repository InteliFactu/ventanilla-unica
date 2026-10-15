import type { DigestName } from '../../types/DigestName'

/** An AutoScript `algorithm` such as `SHA256withRSA`, split into its parts. */
export type AutoScriptAlgorithm = {
  readonly digest: DigestName
  /** The key family it names; absent when it names only the digest (`sha256`). */
  readonly keyType: 'rsa' | 'ec' | undefined
}
