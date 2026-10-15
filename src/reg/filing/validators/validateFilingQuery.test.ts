import { describe, expect, it } from 'vitest'

import { validateFilingQuery } from './validateFilingQuery'

const options = {
  organismo: 'L01100000',
  asunto: 'Escrito',
  expone: 'Que...',
  solicita: 'Que...',
  documentos: 'a.pdf, b.pdf',
  'tipo-via': 'Calle',
  via: 'Mayor 1',
  cp: '10001',
  provincia: 'Cáceres',
  municipio: 'Cáceres',
}

describe('validateFilingQuery', () => {
  it('maps the options and splits the documents', () => {
    const query = validateFilingQuery(options)
    expect(query.documents).toEqual(['a.pdf', 'b.pdf'])
    expect(query.email).toBe('')
  })

  it('refuses a missing field and a bad postal code', () => {
    expect(() => validateFilingQuery({ ...options, asunto: ' ' })).toThrow(
      'needs --asunto',
    )
    expect(() => validateFilingQuery({ ...options, cp: '1000' })).toThrow(
      'five digits',
    )
  })
})
