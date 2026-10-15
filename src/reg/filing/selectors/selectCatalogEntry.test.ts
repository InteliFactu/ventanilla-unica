import { describe, expect, it } from 'vitest'

import { selectCatalogEntry } from './selectCatalogEntry'

const provinces = [
  { code: '10', name: 'Cáceres' },
  { code: '06', name: 'Badajoz' },
]

describe('selectCatalogEntry', () => {
  it('finds by code or by name ignoring accents and case', () => {
    expect(selectCatalogEntry(provinces, '06', 'province').name).toBe('Badajoz')
    expect(selectCatalogEntry(provinces, 'CACERES', 'province').code).toBe('10')
  })

  it('refuses an unknown entry', () => {
    expect(() => selectCatalogEntry(provinces, 'Lugo', 'province')).toThrow(
      'no province "Lugo"',
    )
  })
})
