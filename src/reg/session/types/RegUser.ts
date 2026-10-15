/** `auth/user`: the logged-in holder as the API sees them (the `jwt` field is left out). */
export type RegUser = {
  readonly docType: string
  readonly docNumber: string
  readonly nameUser: string
  readonly firstSurname: string
  readonly familyNameUser: string
  readonly businessName: string | null
}
