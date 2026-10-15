import type { RegFilingQuery } from '../filing/types/RegFilingQuery'

/** A filing query and the temporary directory holding its PDF. */
export type RegFilingFixture = {
  readonly dir: string
  readonly query: RegFilingQuery
}
