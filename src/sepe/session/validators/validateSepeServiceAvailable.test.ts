import { describe, expect, it } from 'vitest'

import type { HttpResponse } from '../../../http/types/HttpResponse'
import { validateSepeServiceAvailable } from './validateSepeServiceAvailable'

const page = (url: string, text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.from(text),
  text,
})

describe('validateSepeServiceAvailable', () => {
  it('passes a service page through', () => {
    const landed = page('https://sede.sepe.gob.es/Servicio.do', '<form></form>')
    expect(validateSepeServiceAvailable(landed)).toBe(landed)
  })

  it('throws with the code of the error page', () => {
    expect(() =>
      validateSepeServiceAvailable(
        page(
          'https://sede.sepe.gob.es/GesUsuariosSEDE/x/error.jsp?errorcode=[TSEG_4003011]',
          '<p>error</p>',
        ),
      ),
    ).toThrow(/TSEG_4003011.*retry later/)
  })
})
