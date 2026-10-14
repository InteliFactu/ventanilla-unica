import { describe, expect, it } from 'vitest'

import { readPartialRedirect } from './readPartialRedirect'

describe('readPartialRedirect', () => {
  it('reads the redirect URL of a JSF partial response', () => {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?><partial-response id="j_id1"><redirect url="https://servicios.ine.es/autenticacion-web/autenticacionClave.xhtml?idApp=id037&amp;nivelAuth=2"></redirect></partial-response>'
    expect(readPartialRedirect(xml)).toBe(
      'https://servicios.ine.es/autenticacion-web/autenticacionClave.xhtml?idApp=id037&nivelAuth=2',
    )
  })

  it('is undefined for a partial response that updates instead', () => {
    expect(
      readPartialRedirect('<partial-response><changes /></partial-response>'),
    ).toBeUndefined()
  })
})
