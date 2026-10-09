import { describe, expect, it } from 'vitest'

import { validateRelecQuery } from './validateRelecQuery'

describe('validateRelecQuery', () => {
  it('normalises a complete invocation', () => {
    expect(
      validateRelecQuery({
        referencia: ' ent2026039187 ',
        documentos: 'a.pdf, b.pdf',
        tipos: 'decl,Alter',
        descripciones: 'Uno | Dos',
        informacion: ' Nota ',
        correo: 'a@example.es',
        telefono: '600 000 000',
      }),
    ).toEqual({
      reference: 'ENT2026039187',
      documents: ['a.pdf', 'b.pdf'],
      typeCodes: ['DECL', 'ALTER'],
      descriptions: ['Uno', 'Dos'],
      information: 'Nota',
      email: 'a@example.es',
      phone: '600000000',
    })
  })

  it('lists every problem before any request', () => {
    expect(() =>
      validateRelecQuery({
        referencia: 'x',
        tipos: 'DECL',
        descripciones: 'Uno|',
      }),
    ).toThrow(
      /--referencia must be .*; --documentos is required.*; --tipos needs one code per document.*; --descripciones needs one non-empty/,
    )
    expect(() =>
      validateRelecQuery({
        referencia: '2026/1A',
        documentos: 'a.pdf',
        tipos: 'DECL',
        descripciones: '|',
      }),
    ).toThrow('--descripciones needs one non-empty description per document')
  })
})
