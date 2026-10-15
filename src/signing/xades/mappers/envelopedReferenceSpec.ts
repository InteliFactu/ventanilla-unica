import type { ReferenceSpec } from '../types/ReferenceSpec'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import { xadesUris } from '../xadesUris'

/**
 * The enveloped Reference: `URI=""` (or `#node` when one element is signed)
 * with the enveloped-signature and, unless the context drops it, C14N
 * transforms.
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
      ? [xadesUris.envelopedSignature, xadesUris.c14n]
      : [xadesUris.envelopedSignature],
    target:
      node === undefined ? { kind: 'enveloped' } : { kind: 'enveloped', node },
  }
}
