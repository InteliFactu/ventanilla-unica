import { extendNamespaceScope } from '../../xml/mappers/extendNamespaceScope'
import { scopeOfPath } from '../../xml/mappers/scopeOfPath'
import { splitQualifiedName } from '../../xml/mappers/splitQualifiedName'
import type { XmlElement } from '../../xml/types/XmlElement'

/** Match direct children by expanded XML name without searching signed content. */
export const selectDirectElementPaths = (
  path: readonly XmlElement[],
  localName: string,
  namespace: string | RegExp,
): readonly (readonly XmlElement[])[] => {
  const parent = path.at(-1)
  const scope = scopeOfPath(path)
  const found: XmlElement[][] = []
  for (const child of parent?.children ?? []) {
    if (child.kind !== 'element') continue
    const { local, prefix } = splitQualifiedName(child.name)
    if (local !== localName) continue
    const uri = extendNamespaceScope(scope, child).get(prefix) ?? ''
    if (typeof namespace === 'string' ? uri === namespace : namespace.test(uri))
      found.push([...path, child])
  }
  return found
}
