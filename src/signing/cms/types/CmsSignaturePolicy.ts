import type { DigestName } from '../../types/DigestName'

/** An explicit signature policy as CAdES names it (SignaturePolicyId). */
export type CmsSignaturePolicy = {
  /** The policy OID, dotted. */
  readonly oid: string
  readonly digest: DigestName
  /** Base64 digest of the policy document. */
  readonly digestValue: string
  /** SPURI qualifier: where the policy document is published. */
  readonly uri?: string | undefined
}
