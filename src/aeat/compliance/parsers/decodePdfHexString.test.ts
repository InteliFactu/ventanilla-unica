import { describe, expect, it } from 'vitest'

import { decodePdfHexString } from './decodePdfHexString'

describe('decodePdfHexString', () => {
  it('decodes WinAnsi bytes, ignoring whitespace', () => {
    expect(decodePdfHexString('43 C1 4345 52 4553')).toBe('CÁCERES')
  })

  it('pads an odd final digit with 0', () => {
    expect(decodePdfHexString('414')).toBe('A@')
  })
})
