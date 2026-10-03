import { describe, expect, it } from 'vitest'

import { encodeLatin1 } from './encodeLatin1'

describe('encodeLatin1', () => {
  it('encodes each character as its single ISO-8859-1 byte', () => {
    expect([...encodeLatin1('Aíÿ')]).toEqual([0x41, 0xed, 0xff])
  })
  it('refuses a character outside ISO-8859-1', () => {
    expect(() => encodeLatin1('€')).toThrow('no ISO-8859-1 byte')
  })
})
