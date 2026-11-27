import { describe, expect, it } from 'vitest'

import { validateContributionQuery } from './validateContributionQuery'

describe('validateContributionQuery', () => {
  it('reads the expediente, the documents and the descriptions', () => {
    expect(
      validateContributionQuery({
        expediente: ' 2099/00002D ',
        documentos: 'a.pdf, b.pdf',
        descripciones: 'Uno, con coma|Dos',
        informacion: ' ',
      }),
    ).toEqual({
      expediente: '2099/00002D',
      documents: ['a.pdf', 'b.pdf'],
      descriptions: ['Uno, con coma', 'Dos'],
      comment: undefined,
    })
  })

  it('refuses a bad number, no documents and surplus descriptions', () => {
    expect(() =>
      validateContributionQuery({ expediente: '25777D', descripciones: 'x' }),
    ).toThrow(
      '--expediente must be the AÑO/NUMERO of an open file, e.g. 2099/00002D; --documentos is required: one or more PDFs, comma-separated; --descripciones has more entries than --documentos',
    )
  })
})
