import type { BulkFile } from '../../../aeat/bulkFiling/types/BulkFile'
import { hasBoeAmountTotal } from '../../boeFixedWidth/validators/hasBoeAmountTotal'

/** Reconcile cash, in-kind and incapacity amounts per the 2025 design. */
export const validateModel190Totals = (file: BulkFile): readonly string[] => {
  const perceptions = file.records.flatMap((record) => [
    record.slice(80, 94),
    record.slice(107, 121),
    record.slice(254, 268),
    record.slice(281, 295),
  ])
  const withholdings = file.records.flatMap((record) => [
    record.slice(94, 107),
    record.slice(121, 134),
    record.slice(268, 281),
    record.slice(295, 308),
  ])
  return [
    hasBoeAmountTotal(file.header.slice(144, 160), perceptions)
      ? ''
      : 'percepciones (145-160): total does not match the detail amounts',
    hasBoeAmountTotal(file.header.slice(160, 175), withholdings, false)
      ? ''
      : 'retenciones (161-175): total does not match the detail amounts',
  ].filter(Boolean)
}
