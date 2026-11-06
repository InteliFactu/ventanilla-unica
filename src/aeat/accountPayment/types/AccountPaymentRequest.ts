/** One AEAT liquidación paid by debit to an account at a collaborating entity. */
export type AccountPaymentRequest = {
  /** NIF of the obligado the document was issued to. */
  readonly nif: string
  /** Pasarela modelo: 002, 004, 008, 010, 031, 032, 060, 061 or 069. */
  readonly modelo: string
  /** The 13-character justificante printed on the document. */
  readonly justificante: string
  /** The exact document amount, `n,nn`: the justificante's control letter depends on it. */
  readonly importe: string
  /** Spanish IBAN without spaces, upper case. */
  readonly iban: string
  /** Apellidos y nombre or razón social; the holder's own name when absent. */
  readonly nombre?: string | undefined
  readonly outDir?: string | undefined
  readonly confirm: boolean
}
