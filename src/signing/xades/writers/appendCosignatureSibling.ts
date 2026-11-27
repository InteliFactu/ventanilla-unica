import { randomUUID } from 'node:crypto'

import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { buildElement } from '../builders/buildElement'

/** Place the co-signature beside the original, wrapping a standalone signature. */
export const appendCosignatureSibling = (
  document: XmlDocument,
  parent: XmlElement | undefined,
  signature: XmlElement,
): void => {
  if (parent === undefined)
    document.root = buildElement(
      'AFIRMA',
      { Id: `AfirmaRoot-${randomUUID()}` },
      [document.root, signature],
    )
  else parent.children.push(signature)
}
