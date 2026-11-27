import type { XmlElement } from '../../xml/types/XmlElement'
import { selectDetachedCosignature } from '../selectors/selectDetachedCosignature'
import type { DetachedCosignature } from '../types/DetachedCosignature'

/** Existing detached siblings must also remain outside the content they sign. */
export const assertDetachedCosignatureSiblings = (
  root: XmlElement,
  original: DetachedCosignature,
  others: readonly XmlElement[],
): void => {
  for (const signature of others) {
    const detached = selectDetachedCosignature(root, signature)
    if (detached === undefined || detached.parent !== original.parent)
      throw new Error('cannot cosign mixed detached XAdES signature placements')
  }
}
