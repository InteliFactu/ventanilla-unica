import type { XmlElement } from '../../signing/xml/types/XmlElement'

/** Facturae 3.2.2 leaves the immediate children in no namespace. */
export const selectFacturaeChild = (
  element: XmlElement | undefined,
  name: string,
  inheritedDefaultNamespace = '',
): XmlElement | undefined => {
  const matches = element?.children.filter(
    (child): child is XmlElement =>
      child.kind === 'element' &&
      child.name === name &&
      (child.attributes.find((attribute) => attribute.name === 'xmlns')
        ?.value ?? inheritedDefaultNamespace) === '',
  )
  return matches?.length === 1 ? matches[0] : undefined
}
