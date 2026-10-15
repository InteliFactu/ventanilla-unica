import type { XmlElement } from '../../xml/types/XmlElement'
import { buildElement } from '../builders/buildElement'
import { qualifiedNameLike } from '../mappers/qualifiedNameLike'

/** Put `property` last in QualifyingProperties' UnsignedProperties/UnsignedSignatureProperties, creating either when missing. */
export const appendUnsignedSignatureProperty = (
  qualifying: XmlElement,
  property: XmlElement,
): void => {
  const child = (parent: XmlElement, local: string): XmlElement => {
    const name = qualifiedNameLike(qualifying, local)
    const found = parent.children.find(
      (node): node is XmlElement =>
        node.kind === 'element' && node.name === name,
    )
    if (found) return found
    const created = buildElement(name, {}, [])
    parent.children.push(created)
    return created
  }
  child(
    child(qualifying, 'UnsignedProperties'),
    'UnsignedSignatureProperties',
  ).children.push(property)
}
