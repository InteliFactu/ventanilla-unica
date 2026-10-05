import { describe, expect, it } from 'vitest'

import { selectListEntry } from './selectListEntry'

const list = [
  { Key: '10', Value: 'Cáceres' },
  { Key: '6', Value: 'Badajoz' },
]

describe('selectListEntry', () => {
  it('matches a name without accents or case', () => {
    expect(selectListEntry(list, 'caceres', 'province')).toEqual({
      key: '10',
      value: 'Cáceres',
    })
  })

  it('matches a key', () => {
    expect(selectListEntry(list, '6', 'province').value).toBe('Badajoz')
  })

  it('refuses an unknown name', () => {
    expect(() => selectListEntry(list, 'Soria', 'province')).toThrow(
      'DGSFP: no province named "Soria"',
    )
  })
})
