import type { XmlElement } from '../../xml/types/XmlElement'
import { requiredNamespaceOfPath } from '../mappers/requiredNamespaceOfPath'
import { assertNoXadesArchiveTimestamp } from '../validators/assertNoXadesArchiveTimestamp'
import { selectCounterSignaturePath } from './selectCounterSignaturePath'
import { selectDirectElementPaths } from './selectDirectElementPaths'
import { selectXadesQualifyingPath } from './selectXadesQualifyingPath'
import { selectXadesSignatureValueId } from './selectXadesSignatureValueId'

/** Traverse only the per-signature XAdES unsigned-property branch. */
export const selectNestedXadesSignatures = (
  signature: readonly XmlElement[],
): readonly (readonly XmlElement[])[] => {
  const qualifying = selectXadesQualifyingPath(signature)
  const namespace = requiredNamespaceOfPath(qualifying)
  const parentValueId = selectXadesSignatureValueId(signature)
  const properties = selectDirectElementPaths(
    qualifying,
    'UnsignedProperties',
    namespace,
  ).flatMap((node) =>
    selectDirectElementPaths(node, 'UnsignedSignatureProperties', namespace),
  )
  assertNoXadesArchiveTimestamp(properties)
  return properties
    .flatMap((node) =>
      selectDirectElementPaths(node, 'CounterSignature', namespace),
    )
    .map((node) => selectCounterSignaturePath(node, parentValueId))
}
