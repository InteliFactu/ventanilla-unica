/** A parsed SignedData, each field kept as its raw DER so rewriting it changes nothing signed. */
export type SignedDataParts = {
  readonly version: Buffer
  readonly digestAlgorithms: readonly Buffer[]
  /** The whole EncapsulatedContentInfo. */
  readonly encapsulated: Buffer
  /** The eContent octets, or undefined when the signature is detached. */
  readonly content: Buffer | undefined
  readonly certificates: readonly Buffer[]
  /** The raw `[1]` crls field, kept as is. */
  readonly crls: Buffer | undefined
  readonly signerInfos: readonly Buffer[]
}
