import type { SexpeDemandStatus } from './SexpeDemandStatus'

/** Administrative status fields from a saved SNE demand result. */
export type SexpeDemand = {
  readonly status: SexpeDemandStatus
  readonly cause: string | null
  readonly employmentStatus: string | null
  readonly specialGroup: string | null
}
