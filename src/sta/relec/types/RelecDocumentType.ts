/** One document type the procedure accepts, from `ApordocAjaxLoader?getTypes=0`. */
export type RelecDocumentType = {
  readonly code: string
  readonly dboid: string
  readonly name: string
  readonly extensions: string
  readonly maxSize: string
  readonly reusable: string
}
