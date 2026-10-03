import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { selectPathBySignedNodeId } from '../selectors/selectPathBySignedNodeId'
import type { SignedContent } from '../types/SignedContent'
import type { XadesMode } from '../types/XadesMode'

/**
 * The document the signature lives in: the content's own document with the
 * signature as the last child of the root (or of the signed node) when
 * enveloped, otherwise a new document whose root is the signature.
 */
export const placeSignature = (
  mode: XadesMode,
  content: SignedContent,
  signature: XmlElement,
): XmlDocument => {
  if (mode !== 'enveloped') return { prolog: [], root: signature, epilog: [] }
  if (content.document === undefined)
    throw new Error('an enveloped signature needs XML content')
  const node = content.signedNodeId
  const host =
    node === undefined
      ? content.document.root
      : selectPathBySignedNodeId(content.document.root, node).at(-1)
  host?.children.push(signature)
  return content.document
}
