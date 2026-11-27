import { extendNamespaceScope } from '../../xml/mappers/extendNamespaceScope'
import type { NamespaceScope } from '../../xml/types/NamespaceScope'
import type { XmlElement } from '../../xml/types/XmlElement'
import { isXmlDsigSignature } from '../../xml/validators/isXmlDsigSignature'
import { xadesUris } from '../xadesUris'
import { selectDirectElementPaths } from './selectDirectElementPaths'

/** Find the outer XML-DSig signatures, stopping before their signed content. */
export const selectTopLevelXadesPaths = (
  element: XmlElement,
  parentPath: readonly XmlElement[],
  inheritedScope: NamespaceScope,
): readonly (readonly XmlElement[])[] => {
  const scope = extendNamespaceScope(inheritedScope, element)
  const path = [...parentPath, element]
  if (isXmlDsigSignature(element, scope))
    return selectDirectElementPaths(path, 'SignedInfo', xadesUris.ds).length ===
      1
      ? [path]
      : []
  return element.children.flatMap((child) =>
    child.kind === 'element'
      ? selectTopLevelXadesPaths(child, path, scope)
      : [],
  )
}
