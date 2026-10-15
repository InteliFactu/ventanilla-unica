/** What `reg presentar` files: the addressee, the writ and the holder's postal address (names or DIR3 codes). */
export type RegFilingQuery = {
  readonly organism: string
  readonly subject: string
  readonly exposes: string
  readonly request: string
  readonly documents: readonly string[]
  readonly viaType: string
  readonly via: string
  readonly zipCode: string
  readonly province: string
  readonly town: string
  readonly email: string
  readonly phone: string
}
