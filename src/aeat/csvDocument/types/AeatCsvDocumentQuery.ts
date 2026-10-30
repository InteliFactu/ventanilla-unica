/** What `aeat cotejo` asks for: the CSV, the addressee's NIF (may be empty) and the --out directory. */
export type AeatCsvDocumentQuery = {
  readonly csv: string
  readonly nif: string
  readonly out: string
}
