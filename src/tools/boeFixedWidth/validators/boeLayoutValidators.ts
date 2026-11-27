import type { BulkFile } from '../../../aeat/bulkFiling/types/BulkFile'
import { validateModel190Records } from '../../model190/validators/validateModel190Records'
import { validateModel347Records } from './validateModel347Records'

/** Field-layout validation is limited to the verified design years. */
export const boeLayoutValidators: Readonly<
  Record<string, (file: BulkFile) => readonly string[]>
> = {
  '190-2025': validateModel190Records,
  '347-2025': validateModel347Records,
}
