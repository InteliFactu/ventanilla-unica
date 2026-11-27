import type { CountersignTarget } from '../../types/CountersignTarget'
import type { XmlElement } from '../../xml/types/XmlElement'
import { selectNestedXadesSignatures } from './selectNestedXadesSignatures'

/** Snapshot the selected original nodes before adding signatures to the document. */
export const selectXadesCountersignTargets = (
  signature: readonly XmlElement[],
  target?: CountersignTarget,
): readonly (readonly XmlElement[])[] => {
  if (target === undefined) return [signature]
  const children = selectNestedXadesSignatures(signature)
  const selected = children.flatMap((child) =>
    selectXadesCountersignTargets(child, target),
  )
  return target === 'tree' || children.length === 0
    ? [signature, ...selected]
    : selected
}
