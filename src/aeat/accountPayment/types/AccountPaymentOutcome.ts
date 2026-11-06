/** The plan for an account-debit payment, and whether the confirmed run may proceed. */
export type AccountPaymentOutcome = {
  readonly plan: readonly string[]
  readonly notes: readonly string[]
  readonly ready: boolean
}
