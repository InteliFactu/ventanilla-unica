import type { DgtContact } from '../../holder/types/DgtContact'
import type { DgtContactQuery } from './DgtContactQuery'

/** The plan, or the outcome, of a contact-data update at the DGT. */
export type DgtContactUpdate = DgtContactQuery & {
  readonly titular: string
  readonly antes?: DgtContact | undefined
  readonly submitted: boolean
  /** The form the update posts (plan mode shows it; it is what was sent when submitted). */
  readonly request: {
    readonly url: string
    readonly fields: Readonly<Record<string, string>>
  }
  /** Read back after the update. */
  readonly despues?: DgtContact | undefined
}
