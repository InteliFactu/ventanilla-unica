/** The filed complaint: registry number, date, CSV and, with `--out`, the saved PDFs. */
export type DgsfpReceipt = {
  readonly registryNumber: string
  readonly registeredAt: string
  readonly csv: string
  readonly justificante?: string | undefined
  readonly solicitud?: string | undefined
}
