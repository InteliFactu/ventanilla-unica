import { selectElementPath } from '../../xml/selectors/selectElementPath'
import { selectXmlAttributeValue } from '../../xml/selectors/selectXmlAttributeValue'
import type { XmlElement } from '../../xml/types/XmlElement'
import type { DetachedCosignature } from '../types/DetachedCosignature'
import { selectUniqueDetachedContentPath } from './selectUniqueDetachedContentPath'
import { selectXadesDataReferences } from './selectXadesDataReferences'

/** Identify external data or a separate subtree without changing enveloped placement. */
export const selectDetachedCosignature = (
  root: XmlElement,
  signature: XmlElement,
): DetachedCosignature | undefined => {
  const signaturePath = selectElementPath(
    root,
    (element) => element === signature,
  )
  if (signaturePath === undefined) return undefined
  const references = selectXadesDataReferences(signaturePath)
  const [referencePath] = references
  if (referencePath === undefined) return undefined
  const uri = selectXmlAttributeValue(referencePath.at(-1), 'URI')
  if (!uri) return undefined
  const contentPath = uri.startsWith('#')
    ? selectUniqueDetachedContentPath(root, uri.slice(1))
    : undefined
  const content = contentPath?.at(-1)
  if (
    contentPath?.includes(signature) ||
    signaturePath.some((node) => node === content)
  )
    return undefined
  if (references.length !== 1)
    throw new Error('detached XAdES cosigning needs one data reference')
  return { signature, referencePath, contentPath, parent: signaturePath.at(-2) }
}
