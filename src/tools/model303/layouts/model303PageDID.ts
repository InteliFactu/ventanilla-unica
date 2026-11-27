import type { Model303PageLayout } from '../types/Model303PageLayout'

/** AEAT workbook 2025/2026, DP303DID. Digit groups list the individual field widths. */
export const model303PageDID: Model303PageLayout = {
  tag: 'DID00',
  length: 823,
  fields: [
    [12, 11, 'An'],
    [23, 34, 'An'],
    [57, 70, 'An'],
    [127, 35, 'An'],
    [162, 30, 'An'],
    [192, 2, 'An'],
    [194, 1, 'Num', ['0', '1', '2', '3']],
    [195, 617, 'An'],
  ],
}
