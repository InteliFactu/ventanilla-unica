import { describe, expect, it } from 'vitest'

import { validateIriaOrderNumber } from './validateIriaOrderNumber'

describe('validateIriaOrderNumber', () => {
  it('accepts ten digits and a letter, normalised', () => {
    expect(validateIriaOrderNumber(' 1005484700i ')).toBe('1005484700I')
  })

  it.each([undefined, '', '1005484700', '100548470I', 'X005484700I'])(
    'rejects %s',
    (value) => {
      expect(() => validateIriaOrderNumber(value)).toThrow(/--orden/)
    },
  )
})
