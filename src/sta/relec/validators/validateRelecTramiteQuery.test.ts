import { describe, expect, it } from 'vitest'

import { validateRelecTramiteQuery } from './validateRelecTramiteQuery'

const options = {
  dboid: '6269000000000000000001',
  asunto: ' Test filing ',
  documentos: 'a.pdf,b.pdf',
  slots: '61,Identity document',
}

describe('validateRelecTramiteQuery', () => {
  it('maps comma-separated slots to one PDF each', () => {
    expect(validateRelecTramiteQuery(options)).toEqual({
      dboid: '6269000000000000000001',
      subject: 'Test filing',
      documents: ['a.pdf', 'b.pdf'],
      rows: ['61', 'Identity document'],
      email: undefined,
      phone: undefined,
    })
  })

  it('preserves a literal pipe in a slot name', () => {
    expect(
      validateRelecTramiteQuery({
        ...options,
        slots: 'Application | signed,Identity',
      }).rows,
    ).toEqual(['Application | signed', 'Identity'])
  })

  it.each([
    [{ dboid: '1' }, '--dboid'],
    [{ asunto: ' ' }, '--asunto'],
    [{ asunto: 'x'.repeat(2501) }, '--asunto'],
    [{ documentos: '' }, '--documentos'],
    [{ slots: '61' }, '--slots'],
    [{ slots: '61,' }, '--slots'],
    [{ slots: '61,61' }, '--slots'],
  ])('rejects invalid invocation %j', (changes, message) => {
    expect(() => validateRelecTramiteQuery({ ...options, ...changes })).toThrow(
      message,
    )
  })
})
