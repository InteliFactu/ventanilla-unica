import type { CatalogEntry } from './CatalogEntry'

/** The holder's address with every catalogue field resolved to its DIR3 code. */
export type RegAddress = {
  readonly viaType: CatalogEntry
  readonly via: string
  readonly zipCode: string
  readonly province: CatalogEntry
  readonly town: CatalogEntry
}
