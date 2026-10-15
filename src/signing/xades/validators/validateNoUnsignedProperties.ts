import type { XmlElement } from '../../xml/types/XmlElement'

/** Refuse QualifyingProperties (the path's last element) that already carry UnsignedProperties. */
export const validateNoUnsignedProperties = (
  qualifying: readonly XmlElement[],
): void => {
  const found = qualifying
    .at(-1)
    ?.children.some(
      (child) =>
        child.kind === 'element' && child.name.endsWith(':UnsignedProperties'),
    )
  if (found === true)
    throw new Error('the signature already has unsigned properties')
}
