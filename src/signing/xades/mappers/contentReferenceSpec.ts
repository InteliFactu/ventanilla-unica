import type { ReferenceSpec } from '../types/ReferenceSpec'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import type { XadesMode } from '../types/XadesMode'
import { xadesUris } from '../xadesUris'

/**
 * The Reference to the signed content: `URI=""` (or `#node` when one
 * element is signed) with the enveloped-signature and C14N transforms; `#<object>` for enveloping (a base64 transform when the
 * content is not XML); the given URI over the raw bytes when detached.
 */
export const contentReferenceSpec = (
  mode: XadesMode,
  context: SignatureContext,
  content: SignedContent,
  detachedUri: string | undefined,
): ReferenceSpec => {
  const id = context.ids.reference
  const node = content.signedNodeId
  if (mode === 'enveloped')
    return {
      id,
      uri: node === undefined ? '' : `#${node}`,
      transforms: [xadesUris.envelopedSignature, xadesUris.c14n],
      target:
        node === undefined
          ? { kind: 'enveloped' }
          : { kind: 'enveloped', node },
    }
  if (mode === 'detached') {
    if (detachedUri === undefined)
      throw new Error('a detached signature needs the content URI')
    return {
      id,
      uri: detachedUri,
      transforms: [],
      target: { kind: 'bytes', data: content.bytes },
    }
  }
  return content.document === undefined
    ? {
        id,
        uri: `#${context.ids.object}`,
        transforms: [xadesUris.base64],
        target: { kind: 'bytes', data: content.bytes },
      }
    : {
        id,
        uri: `#${context.ids.object}`,
        transforms: [],
        target: { kind: 'id', id: context.ids.object },
      }
}
