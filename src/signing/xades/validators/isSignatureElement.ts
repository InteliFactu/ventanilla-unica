import type { XmlElement } from '../../xml/types/XmlElement'

/** Whether `element` is a ds:Signature, under any prefix. */
export const isSignatureElement = (element: XmlElement): boolean =>
  (element.name === 'Signature' || element.name.endsWith(':Signature')) &&
  element.children.some(
    (child) =>
      child.kind === 'element' &&
      (child.name === 'SignedInfo' || child.name.endsWith(':SignedInfo')),
  )
