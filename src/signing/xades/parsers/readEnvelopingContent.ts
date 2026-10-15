import type { XmlElement } from '../../xml/types/XmlElement'
import { formatSignedXml } from '../formatters/formatSignedXml'
import { xadesUris } from '../xadesUris'

/**
 * The content an enveloping signature wraps: the XML element of its content
 * ds:Object (the one without QualifyingProperties), or the bytes when the
 * object is base64.
 */
export const readEnvelopingContent = (signature: XmlElement): Buffer => {
  const object = signature.children.find(
    (child): child is XmlElement =>
      child.kind === 'element' &&
      child.name.endsWith(':Object') &&
      !child.children.some(
        (inner) =>
          inner.kind === 'element' &&
          inner.name.endsWith(':QualifyingProperties'),
      ),
  )
  if (object === undefined)
    throw new Error('the enveloping signature carries no content object')
  const base64 = object.attributes.some(
    (attribute) =>
      attribute.name === 'Encoding' && attribute.value === xadesUris.base64,
  )
  const root = object.children.find(
    (child): child is XmlElement => child.kind === 'element',
  )
  if (base64 || root === undefined)
    return Buffer.from(
      object.children
        .map((child) => (child.kind === 'text' ? child.value : ''))
        .join(''),
      'base64',
    )
  return formatSignedXml({ prolog: [], root, epilog: [] })
}
