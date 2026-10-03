/** A contact way of the holder; `waycode` 21 is an e-mail address. */
export type RegistryContact = {
  readonly waycode: string
  readonly wayvalue: string
  readonly default: boolean
}
