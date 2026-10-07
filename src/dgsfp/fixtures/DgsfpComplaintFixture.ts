import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'

/** A synthetic complaint query and the temp directory its files were written to. */
export type DgsfpComplaintFixture = {
  readonly dir: string
  readonly query: DgsfpComplaintQuery
}
