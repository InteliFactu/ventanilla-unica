import type { BulkFile } from '../../../aeat/bulkFiling/types/BulkFile'
import { validateBoeNif } from '../../boeFixedWidth/validators/validateBoeNif'
import { validateFixedWidthRecord } from '../../boeFixedWidth/validators/validateFixedWidthRecord'
import { model190DeclarantLayout } from '../layouts/model190DeclarantLayout'
import { validateModel190Declarant } from './validateModel190Declarant'
import { validateModel190Perceptor } from './validateModel190Perceptor'
import { validateModel190Totals } from './validateModel190Totals'

/** Check the 2025 declarant and perceptor records, and their declared count. */
export const validateModel190Records = (file: BulkFile): readonly string[] => {
  const headerProblems = [
    ...validateFixedWidthRecord(model190DeclarantLayout, file.header),
    ...validateBoeNif(file.nif, 'nif (9-17)'),
    ...validateModel190Declarant(file.header),
    ...validateModel190Totals(file),
  ]
  if (Number(file.header.slice(135, 144)) !== file.records.length)
    headerProblems.push(
      'registros (136-144): count does not match the detail records',
    )
  return [
    ...headerProblems.map((problem) => `record 1, ${problem}`),
    ...file.records.flatMap((record, index) =>
      validateModel190Perceptor(record).map(
        (problem) => `record ${String(index + 2)}, ${problem}`,
      ),
    ),
  ]
}
