import type { Model303PageLayout } from '../types/Model303PageLayout'
import { model303ResultFields } from './model303ResultFields'

/** AEAT workbook 2025, DP30303. Digit groups list the individual field widths. */
export const model303Page032025: Model303PageLayout = {
  tag: '03000',
  length: 1017,
  fields: [
    ...model303ResultFields,
    [340, [17, 17], 'Num'],
    [374, 17, 'N'],
    [391, 1, 'An', [' ', 'X']],
    [392, 1, 'An', [' ', 'X']],
    [393, 13, 'An'],
    [406, 1, 'An', [' ', 'X']],
    [407, 17, 'N'],
    [424, 17, 'Num'],
    [441, 120, 'An'],
    [561, 1, 'An', [' ', 'X']],
    [562, 1, 'An', [' ', 'X']],
    [563, 443, 'An'],
  ],
}
