import type { ReferenceSpec } from '../types/ReferenceSpec'
import type { SignedContent } from '../types/SignedContent'
import { xadesUris } from '../xadesUris'

/**
 * The Reference to content the signature document wraps under the Id
 * `elementId`: through the given transforms when it is XML, through base64
 * over the raw bytes when it is not.
 */
export const wrappedReferenceSpec = (
  referenceId: string,
  elementId: string,
  content: SignedContent,
  xmlTransforms: readonly string[],
): ReferenceSpec =>
  content.document === undefined
    ? {
        id: referenceId,
        uri: `#${elementId}`,
        transforms: [xadesUris.base64],
        target: { kind: 'bytes', data: content.bytes },
      }
    : {
        id: referenceId,
        uri: `#${elementId}`,
        transforms: xmlTransforms,
        target: { kind: 'id', id: elementId },
      }
