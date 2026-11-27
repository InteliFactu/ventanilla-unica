import { describe, expect, it } from 'vitest'

import type { RegistryAnnotation } from '../types/RegistryAnnotation'
import { selectLatestAnnotation } from './selectLatestAnnotation'

const annotation = (
  description: string,
  at: string | null,
): RegistryAnnotation => ({
  code: null,
  description,
  at,
  observations: null,
  office: null,
})

describe('selectLatestAnnotation', () => {
  it('compares instants, not text, across offsets', () => {
    expect(
      selectLatestAnnotation([
        annotation('utc', '2026-10-06T09:00:00.000+0000'),
        annotation('madrid', '2026-10-06T10:00:00.000+0200'),
      ])?.description,
    ).toBe('utc')
  })

  it('prefers a dated annotation over an undated or unparseable one', () => {
    expect(
      selectLatestAnnotation([
        annotation('dated', '2026-10-05T15:14:30.000+0000'),
        annotation('garbage', 'not a date'),
        annotation('undated', null),
      ])?.description,
    ).toBe('dated')
  })

  it('takes the last among undated, and nothing from an empty list', () => {
    expect(
      selectLatestAnnotation([annotation('a', null), annotation('b', null)])
        ?.description,
    ).toBe('b')
    expect(selectLatestAnnotation([])).toBeUndefined()
  })
})
