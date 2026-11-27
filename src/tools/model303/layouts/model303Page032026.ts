import type { Model303PageLayout } from '../types/Model303PageLayout'
import { model303ResultFields } from './model303ResultFields'

/** AEAT workbook 2026, DP30303. Digit groups list the individual field widths. */
export const model303Page032026: Model303PageLayout = {
  tag: '03000',
  length: 1017,
  fields: [
    ...model303ResultFields,
    [340, 17, 'N'],
    [357, [17, 17, 17], 'Num'],
    [408, 17, 'N'],
    [425, 1, 'An', [' ', 'X']],
    [426, 1, 'An', [' ', 'X']],
    [427, 13, 'An'],
    [440, 1, 'An', [' ', 'X']],
    [441, 17, 'Num'],
    [458, 1, 'An', [' ', 'X']],
    [459, 1, 'An', [' ', 'X']],
    [460, 546, 'An'],
  ],
}
