import type { XmlElement } from '../../signing/xml/types/XmlElement'
import { selectFacturaeChild } from './selectFacturaeChild'

/** Read the single text value of the declared schema version. */
export const selectFacturaeSchemaVersion = (
  root: XmlElement,
  rootDefaultNamespace: string,
): string | undefined => {
  const version = selectFacturaeChild(
    selectFacturaeChild(root, 'FileHeader', rootDefaultNamespace),
    'SchemaVersion',
  )
  const text = version?.children[0]
  return version?.children.length === 1 && text?.kind === 'text'
    ? text.value.trim()
    : undefined
}
