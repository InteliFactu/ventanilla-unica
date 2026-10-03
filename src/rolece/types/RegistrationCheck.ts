/**
 * What the first ROLECE application screen says about an operator:
 * `solicitudInicial` true means it is not inscribed and the next screen asks
 * for the comunidad autónoma of its registered office.
 */
export type RegistrationCheck = {
  readonly nif: string
  readonly inscribed: boolean
  readonly initialApplication: boolean
}
