import type { ReferenceSpec } from '../types/ReferenceSpec'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import { xadesUris } from '../xadesUris'

/**
 * The enveloped Reference: `URI=""` (or `#node` when one element is signed)
 * with the enveloped-signature transform and, unless the context drops them,
 * C14N and AutoFirma's XPath filter `not(ancestor-or-self::ds:Signature)`,
 * which also drops every other signature already in the document.
 */
export const envelopedReferenceSpec = (
  context: SignatureContext,
  content: SignedContent,
): ReferenceSpec => {
  const node = content.signedNodeId
  return {
    id: context.ids.reference,
    uri: node === undefined ? '' : `#${node}`,
    transforms: context.contentC14nTransform
      ? [xadesUris.envelopedSignature, xadesUris.c14n, xadesUris.xpath]
      : [xadesUris.envelopedSignature],
    target: {
      kind: 'enveloped',
      node,
      allSignatures: context.contentC14nTransform,
    },
  }
}
