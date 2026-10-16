/** `site/api/validate/sociedad`: the AEAT census check the identification page runs on the NIF. */
export type CompanyValidation = {
  readonly name?: string | undefined
  readonly provinceCodes?: readonly number[] | undefined
  readonly valid?: boolean | undefined
}
