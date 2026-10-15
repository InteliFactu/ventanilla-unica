/** What `justicia documentos` asks for: one expediente by list index, and where to save its files. */
export type JusticiaDocumentsQuery = {
  readonly index: number
  readonly outDir?: string | undefined
}
