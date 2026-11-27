import type { XmlElement } from '../../xml/types/XmlElement'
import type { PendingReference } from '../types/PendingReference'

/** Refuse a same-document digest whose ID could resolve to more than one element. */
export const assertUniqueXadesReferenceIds = (
  root: XmlElement,
  references: readonly PendingReference[],
): void => {
  const ids = new Set(
    references.flatMap(({ target }) =>
      target.kind === 'id' ? [target.id] : [],
    ),
  )
  const seen = new Set<string>()
  const pending = [root]
  for (
    let element = pending.pop();
    element !== undefined;
    element = pending.pop()
  ) {
    const id = element.attributes.find(({ name }) => name === 'Id')?.value
    if (id !== undefined && ids.has(id)) {
      if (seen.has(id)) throw new Error(`ambiguous XAdES reference Id "${id}"`)
      seen.add(id)
    }
    for (const child of element.children)
      if (child.kind === 'element') pending.push(child)
  }
}
