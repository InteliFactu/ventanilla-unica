/** A checked `caceres aportar` invocation. */
export type RelecQuery = {
  /** The expediente (AÑO/NUMERO) or registry entry (ENT...) the documents belong to. */
  readonly reference: string
  readonly documents: readonly string[]
  /** One document type code per document (DECL, ALTER, CERTI, OTROE...), in order. */
  readonly typeCodes: readonly string[]
  /** One description per document, in order. */
  readonly descriptions: readonly string[]
  /** "Información adicional"; the justificante shows it after the reference. */
  readonly information?: string | undefined
  /** Overrides the e-mail the form prefills for the represented entity. */
  readonly email?: string | undefined
  /** Overrides the phone the form prefills for the represented entity. */
  readonly phone?: string | undefined
}
