/** An informative-return file split into its type 1 record and its type 2 records. */
export type BulkFile = {
  readonly modelo: string
  readonly ejercicio: string
  readonly nif: string
  readonly nombre: string
  readonly recordLength: number
  readonly header: string
  readonly records: readonly string[]
}
