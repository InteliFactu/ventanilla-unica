import { describe, expect, it } from 'vitest'

import { normalizeLabel } from '../mappers/normalizeLabel'
import { selectOptionByLabel } from './selectOptionByLabel'

const options = [
  { value: 'ES431', label: 'BADAJOZ' },
  { value: 'ES432', label: 'CACERES' },
]

describe('selectOptionByLabel', () => {
  it('matches labels without case or accents', () => {
    expect(selectOptionByLabel(options, 'Cáceres')?.value).toBe('ES432')
    expect(normalizeLabel('  la  Rioja ')).toBe('LA RIOJA')
  })

  it('matches the value too, and nothing else', () => {
    expect(selectOptionByLabel(options, 'es431')?.label).toBe('BADAJOZ')
    expect(selectOptionByLabel(options, 'Madrid')).toBeUndefined()
  })
})
