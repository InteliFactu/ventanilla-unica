import { splitQualifiedName } from '../../signing/xml/mappers/splitQualifiedName'
import { selectElementPath } from '../../signing/xml/selectors/selectElementPath'
import type { XmlElement } from '../../signing/xml/types/XmlElement'

/** Refuse to add a second signature to an invoice. */
export const assertUnsignedFacturae = (root: XmlElement): void => {
  const existing = selectElementPath(
    root,
    (element) => splitQualifiedName(element.name).local === 'Signature',
  )
  if (existing !== undefined)
    throw new Error('Facturae already contains a signature')
}
