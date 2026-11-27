import type { XmlElement } from '../../xml/types/XmlElement'
import { buildElement } from '../builders/buildElement'
import { qualifiedNameLike } from '../mappers/qualifiedNameLike'
import { selectDirectElementPaths } from '../selectors/selectDirectElementPaths'

/** Reuse an existing child by namespace identity, even if it changes prefix. */
export const ensureXadesUnsignedElement = (
  path: readonly XmlElement[],
  local: string,
  namespace: string,
): readonly XmlElement[] => {
  const parent = path.at(-1)
  if (parent === undefined) throw new Error('the XAdES path has no parent')
  const matches = selectDirectElementPaths(path, local, namespace)
  if (matches.length > 1) throw new Error(`ambiguous XAdES ${local} elements`)
  const [found] = matches
  if (found !== undefined) return found
  const created = buildElement(qualifiedNameLike(parent, local), {})
  parent.children.push(created)
  return [...path, created]
}
