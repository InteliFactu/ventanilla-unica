import type { BulkFile } from '../../../aeat/bulkFiling/types/BulkFile'
import { model347DeclarantLayout } from '../layouts/model347DeclarantLayout'
import { validateBoeNif } from './validateBoeNif'
import { validateFixedWidthRecord } from './validateFixedWidthRecord'
import { validateModel347Detail } from './validateModel347Detail'
import { validateModel347Totals } from './validateModel347Totals'

/** Check the 2025 declarant and detail records, and separate counts by sheet type. */
export const validateModel347Records = (file: BulkFile): readonly string[] => {
  const headerProblems = [
    ...validateFixedWidthRecord(model347DeclarantLayout, file.header),
    ...validateBoeNif(file.nif, 'nifDeclarante (9-17)'),
    ...validateBoeNif(
      file.header.slice(390, 399),
      'nifRepresentante (391-399)',
      true,
    ),
  ]
  const declared = file.records.filter((record) => record.charAt(75) === 'D')
  const properties = file.records.filter((record) => record.charAt(75) === 'I')
  if (Number(file.header.slice(135, 144)) !== declared.length)
    headerProblems.push(
      'declarados (136-144): count does not match the D records',
    )
  if (Number(file.header.slice(160, 169)) !== properties.length)
    headerProblems.push(
      'inmuebles (161-169): count does not match the I records',
    )
  if (file.header.slice(107, 110) !== '347')
    headerProblems.push('declaracion (108-120): identifier must start with 347')
  headerProblems.push(
    ...validateModel347Totals(file.header, declared, properties),
  )
  return [
    ...headerProblems.map((problem) => `record 1, ${problem}`),
    ...file.records.flatMap((record, index) =>
      validateModel347Detail(record).map(
        (problem) => `record ${String(index + 2)}, ${problem}`,
      ),
    ),
  ]
}
