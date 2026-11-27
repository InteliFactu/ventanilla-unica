import { canonicalizeSubtree } from '../signing/xml/mappers/canonicalizeSubtree'
import type { XmlElement } from '../signing/xml/types/XmlElement'

/** The exclusive canonical bytes signed by the FACe SOAP profiles. */
export const canonicalizeFaceSoapSubtree = (
  path: readonly XmlElement[],
): Buffer =>
  Buffer.from(
    canonicalizeSubtree(path, { exclusive: true, withComments: false }),
  )
