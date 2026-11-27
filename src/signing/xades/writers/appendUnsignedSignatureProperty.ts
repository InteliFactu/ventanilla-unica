import type { XmlElement } from '../../xml/types/XmlElement'
import { buildElement } from '../builders/buildElement'
import { qualifiedNameLike } from '../mappers/qualifiedNameLike'
import { requiredNamespaceOfPath } from '../mappers/requiredNamespaceOfPath'
import { ensureXadesUnsignedElement } from './ensureXadesUnsignedElement'

/** Place a countersignature beside the target's existing unsigned signature properties. */
export const appendUnsignedSignatureProperty = (
  qualifying: readonly XmlElement[],
  signature: XmlElement,
): void => {
  const namespace = requiredNamespaceOfPath(qualifying)
  const unsigned = ensureXadesUnsignedElement(
    qualifying,
    'UnsignedProperties',
    namespace,
  )
  const signatureProperties = ensureXadesUnsignedElement(
    unsigned,
    'UnsignedSignatureProperties',
    namespace,
  ).at(-1)
  if (signatureProperties === undefined)
    throw new Error('the signature has no UnsignedSignatureProperties')
  signatureProperties.children.push(
    buildElement(
      qualifiedNameLike(signatureProperties, 'CounterSignature'),
      {},
      [signature],
    ),
  )
}
