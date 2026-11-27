import type { Model303FieldGroup } from '../types/Model303FieldGroup'

/** Shared positions in DP30301 of the 2025 and 2026 workbooks. */
export const model303IdentificationFields: readonly Model303FieldGroup[] = [
  [12, 1, 'blank'],
  [13, 1, 'A'],
  [14, 9, 'An'],
  [23, 80, 'An'],
  [103, 4, 'Num'],
  [107, 2, 'An'],
  [109, [1, 1, 1, 1, 1, 1, 1, 1, 1], 'Num'],
  [118, 8, 'An'],
  [126, 1, 'An'],
  [127, [1, 1, 1], 'Num'],
]
