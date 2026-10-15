/** Every Id attribute the signature carries. */
export type XadesIds = {
  readonly signature: string
  readonly signedInfo: string
  readonly signatureValue: string
  readonly keyInfo: string
  readonly signedProperties: string
  readonly qualifyingProperties: string
  /** Id of the Reference to the signed content. */
  readonly reference: string
  /** Id of the ds:Object that holds the content when enveloping. */
  readonly object: string
  /** Internally detached: the `AFIRMA` root and the `CONTENT` node. */
  readonly detachedRoot: string
  readonly detachedContent: string
}
