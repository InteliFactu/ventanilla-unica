import type { Organism } from './Organism'

/** `dir3/search?searchText=`: the units whose name matches, up to fifty. */
export type OrganismSearch = {
  readonly items: readonly Organism[]
  readonly totalElements: number
}
