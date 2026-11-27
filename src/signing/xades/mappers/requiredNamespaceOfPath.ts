import { scopeOfPath } from '../../xml/mappers/scopeOfPath'
import { splitQualifiedName } from '../../xml/mappers/splitQualifiedName'
import type { XmlElement } from '../../xml/types/XmlElement'

/** The namespace URI of the last node of a known qualified path. */
export const requiredNamespaceOfPath = (
  path: readonly XmlElement[],
): string => {
  const node = path.at(-1)
  const namespace = scopeOfPath(path).get(
    splitQualifiedName(node?.name ?? '').prefix,
  )
  if (namespace === undefined || namespace === '')
    throw new Error('the XML path has no namespace')
  return namespace
}
