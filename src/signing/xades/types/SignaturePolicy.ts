/** An explicit signature policy (XAdES-EPES SignaturePolicyId). */
export type SignaturePolicy = {
  readonly identifier: string
  readonly description?: string | undefined
  /** Algorithm URI of `digestValue`. */
  readonly digestAlgorithm: string
  /** Base64 digest of the policy document. */
  readonly digestValue: string
  /** SPURI qualifier: where the policy document is published. */
  readonly qualifier?: string | undefined
}
