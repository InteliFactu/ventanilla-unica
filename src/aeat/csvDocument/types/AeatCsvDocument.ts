/** What `aeat cotejo` saved: the CSV it verified, where the PDF went and its size. */
export type AeatCsvDocument = {
  readonly csv: string
  readonly path: string
  readonly bytes: number
}
