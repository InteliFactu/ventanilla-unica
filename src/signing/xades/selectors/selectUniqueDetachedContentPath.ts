import type { XmlElement } from '../../xml/types/XmlElement'

/** Resolve a detached fragment using AutoFirma's three ID spellings. */
export const selectUniqueDetachedContentPath = (
  root: XmlElement,
  id: string,
): readonly XmlElement[] => {
  const pending: XmlElement[][] = [[root]]
  let selected: XmlElement[] | undefined
  for (let path = pending.pop(); path !== undefined; path = pending.pop()) {
    const element = path.at(-1)
    if (element === undefined) continue
    if (
      element.attributes.some(
        ({ name, value }) => /^(?:Id|ID|id)$/u.test(name) && value === id,
      )
    ) {
      if (selected !== undefined)
        throw new Error('ambiguous detached XAdES content ID')
      selected = path
    }
    for (const child of element.children)
      if (child.kind === 'element') pending.push([...path, child])
  }
  if (selected === undefined)
    throw new Error('detached XAdES data reference has no target')
  return selected
}
