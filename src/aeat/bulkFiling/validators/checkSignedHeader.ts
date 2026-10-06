import type { BulkFile } from '../types/BulkFile'
import type { BulkSignatureDialog } from '../types/BulkSignatureDialog'

/**
 * The window shows the type 1 record the AEAT will register, recomputed from
 * the records that passed. Its first 175 characters (declarant, contact,
 * declaration number, count and totals) must equal the file's, or the AEAT
 * would register something other than what was prepared.
 */
export const checkSignedHeader = (
  file: BulkFile,
  dialog: BulkSignatureDialog,
): void => {
  const expected = file.header.slice(0, 175).toUpperCase()
  const shown = dialog.header.slice(0, 175).toUpperCase()
  if (shown !== expected)
    throw new Error(
      `TGVI: the signature window would register "${shown.trim()}" instead of "${expected.trim()}"; nothing is filed`,
    )
}
