import { describe, expect, it } from 'vitest'

import { readSepeOutage } from './readSepeOutage'

describe('readSepeOutage', () => {
  it('reads the TSEG code from the error page URL', () => {
    expect(
      readSepeOutage(
        'https://sede.sepe.gob.es/GesUsuariosSEDE/GestionUsuariosTrabajaWeb/jsp/seguridad/error.jsp?errorcode=[TSEG_4003011]',
        '<p>error</p>',
      ),
    ).toBe('TSEG_4003011')
  })

  it('reads the unavailable notice served on the service URL', () => {
    expect(
      readSepeOutage(
        'https://sede.sepe.gob.es/Servicio/?servicio=1',
        '<p>Aviso: El sitio al que intenta acceder no se encuentra disponible en estos momentos.</p>',
      ),
    ).toBe('sitio no disponible')
  })

  it('answers nothing for a service page', () => {
    expect(
      readSepeOutage('https://sede.sepe.gob.es/Servicio.do', '<form></form>'),
    ).toBeUndefined()
  })
})
