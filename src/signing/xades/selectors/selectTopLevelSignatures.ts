import type { XmlElement } from '../../xml/types/XmlElement'
import { isSignatureElement } from '../validators/isSignatureElement'

/** Every ds:Signature in the tree that is not inside another one (countersignatures excluded), in document order. */
export const selectTopLevelSignatures = (
  element: XmlElement,
): readonly XmlElement[] =>
  isSignatureElement(element)
    ? [element]
    : element.children.flatMap((child) =>
        child.kind === 'element' ? selectTopLevelSignatures(child) : [],
      )
