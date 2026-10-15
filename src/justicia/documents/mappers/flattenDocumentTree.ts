import type { JusticiaDocument } from '../types/JusticiaDocument'
import type { VisorTreeNode } from '../types/VisorTreeNode'
import { mapTreeDocument } from './mapTreeDocument'

/** Every document of the visor tree, in tree order, each with the title of the folder that holds it. */
export const flattenDocumentTree = (
  nodes: readonly VisorTreeNode[],
  carpeta = '',
): readonly JusticiaDocument[] =>
  nodes.flatMap((node): readonly JusticiaDocument[] => {
    const children = node.children ?? []
    // A document's children are its notifications and their receipts.
    return node.isFolder === true
      ? flattenDocumentTree(children, node.title ?? '')
      : [
          mapTreeDocument(node, carpeta),
          ...flattenDocumentTree(children, carpeta),
        ]
  })
