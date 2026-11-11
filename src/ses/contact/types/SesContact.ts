/** The e-mail and phones Centro de Salud Online (SES) holds for its patient. */
export type SesContact = {
  readonly email: string | null
  /** "Tlf. Contacto Asistencial", the number appointment messages go to. */
  readonly careContactPhone: string | null
  readonly phone1: string | null
  readonly phone2: string | null
}
