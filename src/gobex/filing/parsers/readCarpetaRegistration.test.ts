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
  it('recognizes a receipt separated by the live page line breaks and nested markup', () => {
    expect(
      readCarpetaRegistration(
        '<span>Su petición ha sido registrada<br /> con nº <b>2026000000000002</b> y fecha 21/10/2026</span>',
      ),
    ).toBe('2026000000000002')
    expect(
      readCarpetaFilingError(
        '<span>Código: 40090.<br />Error: Error al guardar los documentos adjuntos</span> Valore su experiencia:',
      ),
    ).toBe('Código: 40090. Error: Error al guardar los documentos adjuntos')
  })
})
