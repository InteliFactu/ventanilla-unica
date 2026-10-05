import { describe, expect, it } from 'vitest'

import { validateComplaintQuery } from './validateComplaintQuery'

const valid = {
  entidad: 'Aseguradora Ejemplo, S.A.',
  'nif-entidad': 'a00000000',
  email: 'ana@example.es',
  telefono: '600 000 000',
  direccion: 'Calle Mayor 1',
  provincia: 'Cáceres',
  municipio: 'Cáceres',
  cp: '10001',
  escrito: 'a.pdf',
  sac: 'b.pdf',
  'declaro-no-litigio': 'si',
}

describe('validateComplaintQuery', () => {
  it('normalises a valid set of options', () => {
    const query = validateComplaintQuery(valid)
    expect(query.entityNif).toBe('A00000000')
    expect(query.phone).toBe('600000000')
    expect(query.sacDate).toBeUndefined()
    expect(query.files.condiciones).toBeUndefined()
  })

  it('lists every problem at once', () => {
    expect(() =>
      validateComplaintQuery({
        'nif-entidad': 'X',
        email: 'no',
        cp: '1',
        telefono: '12',
        'fecha-sac': '30/09/2026',
      }),
    ).toThrow(
      /--entidad is required.*--nif-entidad must be a valid NIF.*--email.*--cp.*--telefono.*--fecha-sac.*--declaro-no-litigio si is required/,
    )
  })
})
