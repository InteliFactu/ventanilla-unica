/** A checked `caceres instancia` invocation. */
export type RelecInstanceQuery = {
  /** The "Asunto" (`DinVarANNOT_TEXT_EXTRACT`). */
  readonly subject: string
  readonly documents: readonly string[]
  /** One form row per document, by its name or `DocReq` dboid, in order. */
  readonly rows: readonly string[]
  /** The NIF of a represented entity; without it the holder files in their own name. */
  readonly represented?: string | undefined
  readonly email?: string | undefined
  readonly phone?: string | undefined
}
