import type { RelecDocumentType } from './RelecDocumentType'

/** One entry of `ApordocAjaxLoader?getTypes=0` as it arrives, every field optional. */
export type RawRelecDocumentType = Partial<
  Record<keyof RelecDocumentType, string>
>
