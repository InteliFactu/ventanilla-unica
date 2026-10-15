import type { DgtAtexHolder } from './DgtAtexHolder'
import type { DgtContact } from './DgtContact'
import type { DgtCounters } from './DgtCounters'

/** What the DGT holds about the certificate holder. */
export type DgtHolderData = DgtAtexHolder & {
  /** Undefined when the DGT has no contact data ("No se encuentra ninguna información"). */
  readonly contacto?: DgtContact | undefined
  readonly contadores?: DgtCounters | undefined
}
