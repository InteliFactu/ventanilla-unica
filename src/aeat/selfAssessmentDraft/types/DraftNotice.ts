/** One row of the simulator's "Errores y avisos" table after an import. */
export type DraftNotice = {
  readonly kind: 'error' | 'aviso' | 'correcto'
  /** The file line it refers to, or "-" for the file as a whole. */
  readonly line: string
  readonly code: string
  readonly description: string
}
