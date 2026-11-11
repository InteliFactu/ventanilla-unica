/** The mobile and e-mail Tu Seguridad Social (INSS) sends its messages to. */
export type InssContact = {
  readonly mobilePrefix: string | null
  readonly mobile: string | null
  readonly email: string | null
}
