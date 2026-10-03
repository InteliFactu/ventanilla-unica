import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { signingFixtures } from '../fixtures/signingFixtures'
import { signingScreenHtml } from '../fixtures/signingScreenHtml'
import { readSigningScreen } from './readSigningScreen'

const url =
  'https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action'
const { document, nif } = signingFixtures

describe('readSigningScreen', () => {
  it('reads the document, the onload token and the fields firmaExito submits', () => {
    const screen = readSigningScreen(
      htmlResponse(url, signingScreenHtml(document, nif)),
    )
    expect(screen.document).toBe(document)
    expect(screen.action).toBe(
      'https://registrodelicitadores.gob.es/rolece/comun/firmaSolicitud!firmarSolicitud',
    )
    expect(screen.fields).toMatchObject({
      token: 'onload-token',
      firma: '',
      numDocumento: nif,
    })
    expect(screen.fields).not.toHaveProperty('method:volverSimpliciada')
  })

  it('refuses a page without the form or with a different AutoFirma call', () => {
    expect(() => readSigningScreen(htmlResponse(url, '<p/>'))).toThrow(
      'no signing form',
    )
    expect(() =>
      readSigningScreen(
        htmlResponse(
          url,
          signingScreenHtml(document, nif).replace(
            'SHA256withRSA',
            'SHA512withRSA',
          ),
        ),
      ),
    ).toThrow('no longer asks AutoFirma')
  })
})
