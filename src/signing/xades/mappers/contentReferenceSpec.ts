import type { ReferenceSpec } from '../types/ReferenceSpec'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import type { XadesMode } from '../types/XadesMode'
import { xadesUris } from '../xadesUris'
import { envelopedReferenceSpec } from './envelopedReferenceSpec'
import { wrappedReferenceSpec } from './wrappedReferenceSpec'

/**
 * The Reference to the signed content: the enveloped one; `#<object>` for
 * enveloping; `#CONTENT-...` through C14N when internally detached (base64
 * for non-XML in both); the given URI over the raw bytes when detached.
 */
export const contentReferenceSpec = (
  mode: XadesMode,
  context: SignatureContext,
  content: SignedContent,
  detachedUri: string | undefined,
): ReferenceSpec => {
  const { ids } = context
  if (mode === 'enveloped') return envelopedReferenceSpec(context, content)
  if (mode === 'internally-detached')
    return wrappedReferenceSpec(ids.reference, ids.detachedContent, content, [
      xadesUris.c14n,
    ])
  if (mode === 'enveloping')
    return wrappedReferenceSpec(ids.reference, ids.object, content, [])
  if (detachedUri === undefined)
    throw new Error('a detached signature needs the content URI')
  return {
    id: ids.reference,
    uri: detachedUri,
    transforms: [],
    target: { kind: 'bytes', data: content.bytes },
  }
}
