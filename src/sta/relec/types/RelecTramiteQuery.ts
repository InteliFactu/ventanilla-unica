import type { RelecInstanceQuery } from './RelecInstanceQuery'

/** A catalogue procedure filed exclusively in the certificate holder's name. */
export type RelecTramiteQuery = Omit<RelecInstanceQuery, 'represented'> & {
  readonly dboid: string
}
