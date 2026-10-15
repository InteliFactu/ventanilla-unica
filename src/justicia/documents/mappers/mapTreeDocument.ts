import type { JusticiaDocument } from '../types/JusticiaDocument'
import type { VisorTreeNode } from '../types/VisorTreeNode'

/** One document leaf as returned to the caller; the barcode loses the padding the visor gives it. */
export const mapTreeDocument = (
  node: VisorTreeNode,
  carpeta: string,
): JusticiaDocument => ({
  id: node.id ?? '',
  numero: node.numeroOrden ?? '',
  titulo: node.title ?? '',
  tipo: node.tipo ?? '',
  fecha:
    typeof node.fechaAcontecimiento === 'number'
      ? new Date(node.fechaAcontecimiento).toISOString().slice(0, 10)
      : '',
  carpeta,
  codigoBarras: (node.codigoBarras ?? '').trim(),
  accesible: node.accesible !== false,
})
