import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { CollaboratingEntity } from './CollaboratingEntity'

/** What the read-only part of `aeat pagar` learned before the money-moving step. */
export type AccountPaymentContext = {
  readonly entities: readonly CollaboratingEntity[]
  /** The errors the AEAT printed for the first step; empty when it reached the summary. */
  readonly alerts: readonly string[]
  /** The "Firmar y Enviar" form of the summary page, when the first step was accepted. */
  readonly summary?: HtmlForm | undefined
  /** An NRC MisPagos already lists for the justificante. */
  readonly paidNrc?: string | undefined
  /** False when the obligado differs from the payer and has no separate certificate session. */
  readonly paymentsChecked: boolean
}
