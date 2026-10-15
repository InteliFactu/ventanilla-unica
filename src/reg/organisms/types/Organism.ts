/** One DIR3 unit a REG entry can be addressed to (`cdUtOrganic` is the code `reg presentar --organismo` takes). */
export type Organism = {
  readonly cdUtOrganic: string
  readonly dsUtOrganic: string
  readonly dsAdministrationLevel: string
  readonly dsUtHigher: string | null
  readonly dsUtRoot: string | null
}
