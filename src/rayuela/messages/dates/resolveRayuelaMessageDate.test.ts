import { expect, it } from 'vitest'

import { readRayuelaTodayMs } from './readRayuelaTodayMs'
import { resolveRayuelaMessageDate } from './resolveRayuelaMessageDate'

it.each([
  ['Jueves', '2026-11-12'],
  ['Viernes', '2026-11-06'],
  ['Miércoles', '2026-11-11'],
  ['30 Oct', '2026-10-30'],
  ['30 oct.', '2026-10-30'],
  ['20 Dic', '2025-12-20'],
  ['22/12/2025', '2025-12-22'],
  ['04/11/2025', '2025-11-04'],
  ['29/02/2024', '2024-02-29'],
  ['29/02/2025', null],
  ['31/04/2025', null],
  ['05/13/2025', null],
  ['09:41', '2026-11-13'],
  ['Ayer', '2026-11-12'],
  ['31 Nov', null],
  ['24:00', null],
  ['23:60', null],
  ['unknown', null],
])('resolves the list label %s', (label, expected) => {
  const todayMs = readRayuelaTodayMs(new Date('2026-11-13T10:00:00Z'))
  expect(resolveRayuelaMessageDate(label, todayMs)).toBe(expected)
})

it('uses the Madrid calendar after summer midnight', () => {
  const todayMs = readRayuelaTodayMs(new Date('2026-07-14T22:30:00Z'))
  expect(resolveRayuelaMessageDate('09:41', todayMs)).toBe('2026-07-15')
})

it('preserves dates with an explicit year when the response day is ambiguous', () => {
  expect(resolveRayuelaMessageDate('22/12/2025', null)).toBe('2025-12-22')
  expect(resolveRayuelaMessageDate('22 Dic', null)).toBeNull()
  expect(resolveRayuelaMessageDate('09:41', null)).toBeNull()
})
