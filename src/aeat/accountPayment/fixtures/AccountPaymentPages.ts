/** What the synthetic AEAT portal answers; every field has a happy default. */
export type AccountPaymentPages = {
  readonly blank?: string
  readonly step1?: string
  readonly final?: string | Error
  /** Rows appended to a recognized MisPagos page. */
  readonly payments?: string
  readonly paymentsHtml?: string
  readonly paymentsStatus?: number
  readonly certificateNif?: string
  readonly pdf?: string
}
