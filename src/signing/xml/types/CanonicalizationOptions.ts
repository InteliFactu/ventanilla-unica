/** How a node set is canonicalised. */
export type CanonicalizationOptions = {
  /** Keep comments (the `#WithComments` variants). */
  readonly withComments: boolean
  /** Exclusive C14N instead of inclusive C14N 1.0. */
  readonly exclusive: boolean
  /** Exclusive C14N's InclusiveNamespaces PrefixList (`#default` for the default namespace). */
  readonly inclusivePrefixes?: readonly string[] | undefined
  /** An element left out with its whole subtree (the enveloped-signature transform). */
  readonly exclude?: object | undefined
  /** Leave out every ds:Signature subtree, as the XPath filter `not(ancestor-or-self::ds:Signature)` does. */
  readonly excludeSignatures?: boolean | undefined
}
