import { describe, expect, it } from 'vitest'

import { readRegistryItems } from './readRegistryItems'

const refused = 'no asientos list'

describe('readRegistryItems', () => {
  it('returns the asientos array as it is', () => {
    expect(readRegistryItems({ asientos: [{ a: 1 }] }, 1)).toEqual([{ a: 1 }])
  })

  it('accepts a missing or null list only at an explicit zero total', () => {
    expect(readRegistryItems({}, 0)).toEqual([])
    expect(readRegistryItems({ asientos: null }, 0)).toEqual([])
    expect(() => readRegistryItems({}, 3)).toThrow(refused)
    expect(() => readRegistryItems({ asientos: null }, 3)).toThrow(refused)
  })

  it('refuses a list of another shape', () => {
    expect(() => readRegistryItems({ asientos: {} }, 0)).toThrow(refused)
    expect(() => readRegistryItems({ asientos: 'x' }, 3)).toThrow(refused)
  })
})
