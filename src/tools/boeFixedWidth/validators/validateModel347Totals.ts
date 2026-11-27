import { hasBoeAmountTotal } from './hasBoeAmountTotal'

/** Reconcile annual operations against D sheets and rents against I sheets. */
export const validateModel347Totals = (
  header: string,
  declared: readonly string[],
  properties: readonly string[],
): readonly string[] =>
  [
    hasBoeAmountTotal(
      header.slice(144, 160),
      declared.map((record) => record.slice(82, 98)),
    )
      ? ''
      : 'importeOperaciones (145-160): total does not match the D records',
    hasBoeAmountTotal(
      header.slice(169, 185),
      properties.map((record) => record.slice(98, 114)),
    )
      ? ''
      : 'importeArrendamientos (170-185): total does not match the I records',
  ].filter(Boolean)
