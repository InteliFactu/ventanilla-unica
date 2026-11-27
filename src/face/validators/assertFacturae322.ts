import { baseNamespaceScope } from '../../signing/xml/mappers/baseNamespaceScope'
import { extendNamespaceScope } from '../../signing/xml/mappers/extendNamespaceScope'
import { splitQualifiedName } from '../../signing/xml/mappers/splitQualifiedName'
import type { XmlElement } from '../../signing/xml/types/XmlElement'
import { facturae322Namespace } from '../facturae322Namespace'
import { selectFacturaeChild } from '../selectors/selectFacturaeChild'
import { selectFacturaeSchemaVersion } from '../selectors/selectFacturaeSchemaVersion'

/** Check the top-level shape of one unsigned Facturae 3.2.2 invoice. */
export const assertFacturae322 = (root: XmlElement): void => {
  const { local, prefix } = splitQualifiedName(root.name)
  const namespace = extendNamespaceScope(baseNamespaceScope(), root)
  const rootDefaultNamespace = namespace.get('') ?? ''
  if (
    local !== 'Facturae' ||
    namespace.get(prefix) !== facturae322Namespace ||
    selectFacturaeSchemaVersion(root, rootDefaultNamespace) !== '3.2.2' ||
    selectFacturaeChild(root, 'Parties', rootDefaultNamespace) === undefined ||
    selectFacturaeChild(
      selectFacturaeChild(root, 'Invoices', rootDefaultNamespace),
      'Invoice',
    ) === undefined
  ) {
    throw new Error('FACe preparation needs one Facturae 3.2.2 invoice')
  }
}
