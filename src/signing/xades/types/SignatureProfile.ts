import type { DigestName } from '../../types/DigestName'

/** The resolved knobs that shape a signature to what a portal expects. */
export type SignatureProfile = {
  readonly signatureDigest: DigestName
  readonly referencesDigest: DigestName
  readonly signerRoles: readonly string[]
  readonly contentC14nTransform: boolean
  readonly objectIdentifier: string | undefined
}
