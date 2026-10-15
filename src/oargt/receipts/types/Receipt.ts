import type { AmountToday } from './AmountToday'
import type { ReceiptTab } from './ReceiptTab'

/** One OARGT receipt row, already validated out of the portal's `dataset_DEUDAPENDIENTE` JSON. */
export type Receipt = {
  readonly tab: ReceiptTab
  readonly reference: string
  readonly number?: string | undefined
  readonly concept: string
  readonly entity: string
  readonly principal: string
  readonly pending: string
  readonly principalNumber: number
  readonly pendingNumber: number
  readonly situation: string
  readonly directDebit: boolean
  readonly enforced: boolean
  readonly voluntaryPeriod?: string | undefined
  /** The year and month the receipt charges for, as the portal writes it ("2026 / 6"). */
  readonly accountingPeriod?: string | undefined
  readonly paid: boolean
  /** Present on enforced receipts when the caller asked for today's amount and the portal answered. */
  readonly amountToday?: AmountToday | undefined
}
