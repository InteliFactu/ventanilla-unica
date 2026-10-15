/** One row of "Mis registros" as `registry/searchRegistry` answers it. */
export type RegistrySummary = {
  readonly registryNumber: string
  readonly registryNumberTemporary: string
  readonly status: string
  readonly entryDate: string
  readonly destinyOrganism: string
  readonly subject: string
  readonly actLike: string
  readonly uuid: string
  readonly appUser: string
}
