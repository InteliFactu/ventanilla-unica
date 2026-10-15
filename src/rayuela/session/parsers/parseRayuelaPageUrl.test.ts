import { expect, it } from 'vitest'
import { parseRayuelaPageUrl } from './parseRayuelaPageUrl'

it('parseRayuelaPageUrl reads synthetic portal markup and rejects unsupported input', () => {
  const session = { window: 'w & x', menu: 'm', navigation: 'b' }
  const url = new URL(
    parseRayuelaPageUrl(
      `var c_HoraAlumno= 456; <div accion="('HoraAlumno','789','extra')">`,
      'HoraAlumno',
      session,
    ),
  )
  expect(url.pathname).toBe('/segedu/jsp/Principal.jsp')
  expect(Object.fromEntries(url.searchParams)).toEqual({
    COD_PAGINA: '456',
    X_MENU: '789',
    X_MENU_LLAMADA: '789',
    DESDE_MENU_: 'S',
    PRIMERA_VISITA_: 'S',
    N_V_: 'w & x',
  })
  expect(() => parseRayuelaPageUrl('', 'HoraAlumno', session)).toThrow(
    'not found',
  )
})
