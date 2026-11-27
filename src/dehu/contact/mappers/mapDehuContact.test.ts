import { describe, expect, it } from 'vitest'

import { mapDehuContact } from './mapDehuContact'

describe('DEHU email confirmation status', () => {
  it.each([
    [1, true],
    [2, true],
    ['1', true],
    ['2', true],
    [0, false],
    [3, false],
    [4, false],
    ['0', false],
    ['3', false],
    ['4', false],
    [null, false],
    [true, false],
    ['01', false],
  ] as const)('maps remote status %j to confirmed=%s', (status, confirmed) => {
    const email = 'holder@example.test'
    const contact = mapDehuContact(
      { email1: email, email1_confirmacion: status },
      '00000000T',
    )

    expect(contact.emails).toEqual([{ email, confirmed }])
  })
})
