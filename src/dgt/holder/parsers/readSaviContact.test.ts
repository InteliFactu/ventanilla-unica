import { describe, expect, it } from 'vitest'

import { readSaviContact } from './readSaviContact'

describe('readSaviContact', () => {
  it('reads the stored email and phone', () => {
    expect(
      readSaviContact({ ok: { email: ' a@b.es ', tel: '0034600000000' } }),
    ).toEqual({ email: 'a@b.es', telefono: '0034600000000' })
  })

  it('answers undefined when the DGT has no contact data, and fails on other errors', () => {
    expect(
      readSaviContact({
        error: {
          errorCode: '001',
          errorMsg: 'No se encuentra ninguna información',
        },
      }),
    ).toBeUndefined()
    expect(() =>
      readSaviContact({ error: { errorCode: '500', errorMsg: 'Caído' } }),
    ).toThrow('Caído')
    expect(() => readSaviContact({})).toThrow('unexpected answer')
  })
})
