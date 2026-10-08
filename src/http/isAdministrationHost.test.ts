import { describe, expect, it } from 'vitest'

import { isAdministrationHost } from './isAdministrationHost'

describe('isAdministrationHost', () => {
  it('accepts the portals and the Cl@ve relay', () => {
    for (const host of [
      'sede.agenciatributaria.gob.es',
      'pasarela.clave.gob.es',
      'idp.seg-social.es',
      'dehu.redsara.es',
      'sede.oargt.es',
      'aps.bde.es',
      'tramites.juntaex.es',
      'sede.caceres.es',
      'sede.gobex.es',
      'SEDE.SEPE.GOB.ES',
      'registrodelicitadores.gob.es',
      'contrataciondelestado.es',
      'www.nic.es',
    ])
      expect(isAdministrationHost(host)).toBe(true)
  })

  it('refuses look-alikes and foreign hosts', () => {
    for (const host of [
      'evilgob.es',
      'gob.es.example',
      'example.com',
      'bde.es.evil.net',
    ])
      expect(isAdministrationHost(host)).toBe(false)
  })
})
