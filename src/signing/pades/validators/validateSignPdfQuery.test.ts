import { describe, expect, it } from 'vitest'

import { validateSignPdfQuery } from './validateSignPdfQuery'

describe('validateSignPdfQuery', () => {
  it('maps the options to signPdf options', () => {
    expect(
      validateSignPdfQuery({
        in: 'a.pdf',
        out: 'b.pdf',
        pagina: '-1',
        posicion: '10, 20, 210, 80',
        texto: 'Firmado por $$SUBJECTCN$$',
        campo: 'Firma1',
      }).options,
    ).toMatchObject({
      visible: false,
      page: -1,
      rect: [10, 20, 210, 80],
      text: 'Firmado por $$SUBJECTCN$$',
      field: 'Firma1',
    })
  })

  it.each([
    [{ in: 'a.pdf' }, '--in and --out'],
    [{ in: 'a', out: 'b', pagina: '0' }, 'non-zero integer'],
    [{ in: 'a', out: 'b', posicion: '10,20,5,80' }, 'urx > llx'],
    [{ in: 'a', out: 'b', posicion: '1,2,3' }, 'llx,lly,urx,ury'],
  ])('refuses %o', (options, message) => {
    expect(() => validateSignPdfQuery(options)).toThrow(message)
  })
})
