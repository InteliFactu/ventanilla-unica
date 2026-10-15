import type { XmlElement } from '../../xml/types/XmlElement'

/** The `Id` of an element, refusing one without it. */
export const selectIdOf = (element: XmlElement | undefined): string => {
  const id = element?.attributes.find(
    (attribute) => attribute.name === 'Id',
  )?.value
  if (id === undefined)
    throw new Error(`${element?.name ?? 'the element'} has no Id`)
  return id
}
