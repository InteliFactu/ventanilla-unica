import type { DgsfpKeyValue } from './DgsfpKeyValue'

/** The sede's list of the municipalities of one province. */
export type DgsfpMunicipalitiesAnswer = {
  readonly municipios: readonly DgsfpKeyValue[]
}
