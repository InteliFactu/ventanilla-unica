import { describe, expect, it } from 'vitest'

import { certificateSearchHtml } from '../fixtures/certificateSearchHtml'
import { readCertificateRows } from './readCertificateRows'

describe('readCertificateRows', () => {
  it('reads a row the registry does not know', () => {
    expect(
      readCertificateRows(
        certificateSearchHtml('B00000000', 'NO INSCRITO EN EL REGISTRO'),
      ),
    ).toEqual([
      {
        nif: 'B00000000',
        denominacion: 'NO INSCRITO EN EL REGISTRO',
        inscribed: false,
      },
    ])
  })

  it('reads an inscribed operator and nothing without the table', () => {
    expect(
      readCertificateRows(certificateSearchHtml('B00000000', 'EJEMPLO SL'))[0],
    ).toMatchObject({ denominacion: 'EJEMPLO SL', inscribed: true })
    expect(readCertificateRows('<p>nada</p>')).toEqual([])
  })
})
