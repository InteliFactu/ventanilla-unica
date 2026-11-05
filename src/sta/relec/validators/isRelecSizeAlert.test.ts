import { describe, expect, it } from 'vitest'

import { isRelecSizeAlert } from './isRelecSizeAlert'

describe('isRelecSizeAlert', () => {
  it('recognises the FileUploader size alert in any encoding of the accent', () => {
    expect(
      isRelecSizeAlert(
        '<script>alert("Tamaño de archivo excedido. Limite 50000 KBytes");</script>',
      ),
    ).toBe(true)
    expect(
      isRelecSizeAlert("alert( 'Tama&ntilde;o de archivo excedido' )"),
    ).toBe(true)
  })

  it('ignores a successful upload and unrelated alerts', () => {
    expect(isRelecSizeAlert('<script>parent.uploadEnd();</script>')).toBe(false)
    expect(isRelecSizeAlert('alert("Sesión caducada")')).toBe(false)
  })
})
