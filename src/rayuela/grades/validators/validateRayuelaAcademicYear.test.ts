import { expect, it } from 'vitest'
import { validateRayuelaAcademicYear } from './validateRayuelaAcademicYear'

it('validateRayuelaAcademicYear accepts a start year or a consecutive pair', () => {
  expect(validateRayuelaAcademicYear('2025')).toBe('2025')
  expect(validateRayuelaAcademicYear('2025-2026')).toBe('2025')
  for (const value of ['2025-2027', '25', '2025/2026', '', '2025-'])
    expect(() => validateRayuelaAcademicYear(value)).toThrow('--curso')
})
