/** One document row of a Relec form, as its `<DocReq>_NEW*` hidden inputs declare it. */
export type RelecSlot = {
  /** The row's `DocReq` dboid, which keys its inputs. */
  readonly dboid: string
  readonly name: string
  readonly description: string
  readonly required: boolean
  /** The document type dboid the row files under. */
  readonly typeDboid: string
}
