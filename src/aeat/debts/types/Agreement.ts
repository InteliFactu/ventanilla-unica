import type { AgreementDetail } from './AgreementDetail'
import type { AgreementInstalment } from './AgreementInstalment'

/** One SRAF deferral/instalment agreement: its code plus everything read off its detail page. */
export type Agreement = AgreementDetail & {
  readonly acuerdo: string
  /** The current SRAF calendar when the linked table could be verified. */
  readonly currentInstalments?: readonly AgreementInstalment[]
  /** Present when a linked calendar could not be read in full. */
  readonly currentInstalmentsNote?: string
}
