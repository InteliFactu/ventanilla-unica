/** `aeat informativa`: the file to validate or present, and its period (`0A` for annual returns). */
export type BulkFilingQuery = {
  readonly fichero: string
  readonly periodo: string
}
