import { describe, expect, it } from 'vitest'

import { readCarpetaFilingError } from './readCarpetaFilingError'
import { readCarpetaRegistration } from './readCarpetaRegistration'

describe('Carpeta registration evidence', () => {
  it('requires a concrete receipt and does not mistake a static hidden modal for registration', () => {
    expect(
      readCarpetaRegistration('El documento se ha firmado correctamente'),
    ).toBeUndefined()
    expect(
      readCarpetaRegistration(
        'Su petici&oacute;n ha sido registrada con n&ordm; 2026000000000001',
      ),
    ).toBe('2026000000000001')
  })
  it('preserves a portal persistence error instead of calling HTTP 200 a success', () => {
    const error =
      'C&oacute;digo: 40090. Error: Error al guardar los documentos adjuntos'
    expect(readCarpetaFilingError(error)).toBe(
      'Código: 40090. Error: Error al guardar los documentos adjuntos',
    )
    expect(readCarpetaRegistration(error)).toBeUndefined()
  })
})
