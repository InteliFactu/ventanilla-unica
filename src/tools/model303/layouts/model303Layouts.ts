import type { Model303PageLayout } from '../types/Model303PageLayout'
import { model303Page012025 } from './model303Page012025'
import { model303Page012026 } from './model303Page012026'
import { model303Page02 } from './model303Page02'
import { model303Page032025 } from './model303Page032025'
import { model303Page032026 } from './model303Page032026'
import { model303Page04 } from './model303Page04'
import { model303Page052025 } from './model303Page052025'
import { model303Page052026 } from './model303Page052026'
import { model303PageDID } from './model303PageDID'

/**
 * AEAT workbooks DR303e25.xlsx and DR303e26v101.xlsx, respectively.
 * A new exercise must opt in after checking its published workbook.
 */
export const model303Layouts: Readonly<
  Record<string, readonly Model303PageLayout[]>
> = {
  '2025': [
    model303Page012025,
    model303Page02,
    model303Page032025,
    model303Page04,
    model303Page052025,
    model303PageDID,
  ],
  '2026': [
    model303Page012026,
    model303Page02,
    model303Page032026,
    model303Page04,
    model303Page052026,
    model303PageDID,
  ],
}
