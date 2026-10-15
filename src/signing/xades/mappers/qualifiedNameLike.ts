import type { XmlElement } from '../../xml/types/XmlElement'

/** `local` under the same prefix as `reference` (none when it has none). */
export const qualifiedNameLike = (
  reference: XmlElement,
  local: string,
): string => {
  const colon = reference.name.indexOf(':')
  return colon === -1 ? local : `${reference.name.slice(0, colon)}:${local}`
}
