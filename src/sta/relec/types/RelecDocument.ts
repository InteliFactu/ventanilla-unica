import type { RelecFile } from './RelecFile'

/** One document of the filing: the file, the name the sede will store, its type and description. */
export type RelecDocument = RelecFile & {
  /** The name the sede's uploader keeps: only `[A-Za-z0-9._-]`. */
  readonly uploadName: string
  readonly typeCode: string
  readonly typeDboid: string
  readonly description: string
}
