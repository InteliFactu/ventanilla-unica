import { describe, expect, it } from 'vitest'

import { relecFormHtml } from '../fixtures/relecFormHtml'
import { parseRelecForm } from '../parsers/parseRelecForm'
import { mapJsEscape } from './mapJsEscape'
import { mapRelecPlan } from './mapRelecPlan'
import { mapRepresentedParty } from './mapRepresentedParty'
import { mapUploadName } from './mapUploadName'

const query = {
  reference: '2026/1A',
  documents: [],
  typeCodes: [],
  descriptions: [],
}

describe('Relec mappers', () => {
  it('escapes like JavaScript escape()', () => {
    expect(mapJsEscape('a b/ñ€@*_+-.x')).toBe('a%20b/%F1%u20AC@*_+-.x')
  })

  it('keeps only the characters the uploader keeps', () => {
    expect(mapUploadName('/tmp/Año 2026 (1).pdf')).toBe('Ao20261.pdf')
    expect(() => mapUploadName('/tmp/ñ.pdf')).toThrow(
      'no usable characters left',
    )
  })

  it('names a natural person by full name and NIF', () => {
    expect(
      mapRepresentedParty(
        {
          RepNombre: 'LUIS',
          RepApellido1: 'GOMEZ',
          RepDocuNum: '87654321',
          RepDigito: 'X',
        },
        'RF',
        'x',
      ),
    ).toEqual({ name: 'LUIS GOMEZ', nif: '87654321X' })
    expect(mapRepresentedParty({}, 'RF', 'LABEL').name).toBe('LABEL')
  })

  it('needs an e-mail and an entity to represent', () => {
    const form = parseRelecForm(
      relecFormHtml,
      'https://sede.caceres.es/sta/Relec/TramitaForm',
    )
    expect(() =>
      mapRelecPlan('h', query, { ...form, contact: {} }, []),
    ).toThrow('--correo is required')
    expect(() =>
      mapRelecPlan('h', query, { ...form, represented: [] }, []),
    ).toThrow('files as representative only')
  })
})
