import { describe, expect, it } from 'vitest'

import { validateRegistryQuery } from './validateRegistryQuery'

describe('validateRegistryQuery', () => {
  it('normalises the options', () => {
    expect(
      validateRegistryQuery({
        destino: ' a11030071 ',
        telefono: '697 71 23 44',
        asunto: ' Asunto ',
        documentos: 'a.pdf, b.pdf,',
      }),
    ).toEqual({
      destination: 'A11030071',
      phone: '697712344',
      subject: 'Asunto',
      documents: ['a.pdf', 'b.pdf'],
    })
  })

  it('names every missing or malformed option at once', () => {
    expect(() => validateRegistryQuery({ destino: 'X' })).toThrow(
      '--destino must be the DIR3 code of the addressee unit, e.g. A11030071; --telefono must be a phone number; --asunto is required (the EXPONE/SOLICITA line); --documentos is required: one or more PDFs, comma-separated',
    )
  })
})
