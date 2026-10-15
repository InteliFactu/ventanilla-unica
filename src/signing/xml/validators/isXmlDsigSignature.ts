import type { NamespaceScope } from '../types/NamespaceScope'
import type { XmlElement } from '../types/XmlElement'

/** Whether `element`, read in its own namespace scope, is an XML-DSig ds:Signature. */
export const isXmlDsigSignature = (
  element: XmlElement,
  scope: NamespaceScope,
): boolean => {
  const colon = element.name.indexOf(':')
  const local = colon === -1 ? element.name : element.name.slice(colon + 1)
  const prefix = colon === -1 ? '' : element.name.slice(0, colon)
  return (
    local === 'Signature' &&
    scope.get(prefix) === 'http://www.w3.org/2000/09/xmldsig#'
  )
}
