import type { Organism } from '../../organisms/types/Organism'
import type { RegSession } from '../../session/types/RegSession'
import type { FilingPdf } from './FilingPdf'
import type { RegAddress } from './RegAddress'

/** Everything the reads established before anything is written. */
export type PreparedRegFiling = {
  readonly session: RegSession
  readonly organism: Organism
  readonly address: RegAddress
  readonly pdfs: readonly FilingPdf[]
}
