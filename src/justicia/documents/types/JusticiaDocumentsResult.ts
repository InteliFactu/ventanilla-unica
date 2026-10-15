import type { JusticiaDocument } from './JusticiaDocument'

/** What `justicia documentos` returns. */
export type JusticiaDocumentsResult = {
  readonly procedimiento: string
  readonly documentos: readonly JusticiaDocument[]
  readonly notes: readonly string[]
}
