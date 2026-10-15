import type { RegistryDocument } from './RegistryDocument'

/** `registry/:uuid`, as much of it as the CLI reports; `cdStatus` `EN` is sent, `CF` confirmed. */
export type RegistryDetail = {
  readonly registryData: {
    readonly registryNumber: string
    readonly entryDate: string
    readonly cdDestinyOrganism: string
    readonly destinyOrganism: string
    readonly cdStatus: string
    readonly status: string
    readonly subject: string
    readonly exposes: string
    readonly solicit: string
  }
  readonly document: readonly RegistryDocument[]
}
