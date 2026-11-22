/** What the form shows right before signing: the result, how it is settled, and who signs for whom. */
export type PresentationCheck = {
  /** The form's "Resultado", as it prints it (`-1.109,76`). */
  readonly resultado: string
  /** The "Forma de pago" the form chose from the file (`A compensar`, `Solicitud de devolución`...). */
  readonly formaDePago: string
  /** The certificate holder, `NIF NAME`. */
  readonly signer: string
  /** The declarant the certificate signs for, `NIF NAME`. */
  readonly onBehalfOf: string
  /** The text the signature covers: the declaration in its file format. */
  readonly signedText: string
}
