/** One bank the AEAT accepts account debits from (VerEntidadesAdheridas). */
export type CollaboratingEntity = {
  /** The four-digit entity code, positions 5-8 of a Spanish IBAN. */
  readonly codigo: string
  readonly nombre: string
}
