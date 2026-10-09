/** How a person takes part: as the agent of another or not, and the postal address it is reached at (`null` for none). */
export type RegistryPartyRole = {
  readonly isAgent: boolean
  readonly party: Readonly<Record<string, unknown>> | null
}
