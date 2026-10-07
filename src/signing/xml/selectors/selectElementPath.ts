import type { ElementPathStep } from '../types/ElementPathStep'
import type { XmlElement } from '../types/XmlElement'

/** The path from `root` down to the first element `matches` accepts, both included; undefined if none. */
export const selectElementPath = (
  root: XmlElement,
  matches: (element: XmlElement) => boolean,
): XmlElement[] | undefined => {
  const pending: ElementPathStep[] = [{ element: root, path: [root] }]
  for (let item = pending.pop(); item !== undefined; item = pending.pop()) {
    const { element, path } = item
    if (matches(element)) return path
    const children = element.children.filter(
      (child): child is XmlElement => child.kind === 'element',
    )
    for (const child of children.toReversed())
      pending.push({ element: child, path: [...path, child] })
  }
  return undefined
}
