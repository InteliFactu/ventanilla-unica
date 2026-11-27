import type { XmlElement } from '../../xml/types/XmlElement'

/** What a ds:Reference digests. */
export type ReferenceTarget =
  | {
      readonly kind: 'enveloped'
      readonly node?: string | undefined
      /** The XPath filter drops every ds:Signature, not only this one. */
      readonly allSignatures?: boolean | undefined
    }
  | { readonly kind: 'id'; readonly id: string }
  | { readonly kind: 'subtree'; readonly path: readonly XmlElement[] }
  | { readonly kind: 'bytes'; readonly data: Buffer }
