import type { XmlElement } from '../types/XmlElement'

/** Read the unexpanded value of a named XML attribute. */
export const selectXmlAttributeValue = (
  element: XmlElement | undefined,
  attribute: string,
): string | undefined =>
  element?.attributes.find(({ name }) => name === attribute)?.value
