import { selectElementPath } from '../../xml/selectors/selectElementPath'
import type { XmlElement } from '../../xml/types/XmlElement'

/**
 * The root-to-element path of the node an enveloped signature signs by
 * reference (AutoFirma's `nodeToSign`): the element whose `Id`, `ID` or `id`
 * attribute is `id`, the three spellings AutoFirma's dereferencer accepts.
 */
export const selectPathBySignedNodeId = (
  root: XmlElement,
  id: string,
): XmlElement[] => {
  const idAttributes = new Set(['Id', 'ID', 'id'])
  const path = selectElementPath(root, (element) =>
    element.attributes.some(
      (attribute) => idAttributes.has(attribute.name) && attribute.value === id,
    ),
  )
  if (path === undefined) throw new Error(`no element to sign with id "${id}"`)
  return path
}
