import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { assertNotaPage } from './assertNotaPage'

describe('assertNotaPage', () => {
  it('quotes the first visible error message', () => {
    const page = htmlResponse(
      'https://sede.registradores.org/site/certificado/identificacion?x=1',
      '<div class="form-msg form-msg--error hide"><p>hidden</p></div><div class="form-msg form-msg--error"><p>VIES no válido</p></div>',
    )
    expect(() => {
      assertNotaPage(page, 'solicitud/pagar', 'the identification')
    }).toThrow(
      'the identification did not reach the next page (HTTP 200 at https://sede.registradores.org/site/certificado/identificacion): VIES no válido',
    )
  })

  it('passes a page carrying the marker', () => {
    expect(() => {
      assertNotaPage(
        htmlResponse('https://x.example/', 'solicitud/pagar'),
        'solicitud/pagar',
        's',
      )
    }).not.toThrow()
  })
})
