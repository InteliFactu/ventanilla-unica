import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from './fetchers/fetchRayuelaPage'
import { rayuelaChildSelectionPages } from './fixtures/rayuelaChildSelectionPages'
import { scriptedRayuelaSession } from './fixtures/scriptedRayuelaSession'
import { openRayuelaSession } from './openRayuelaSession'

beforeEach(() => {
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
})
afterEach(() => {
  vi.unstubAllEnvs()
})
it.each([
  { query: 'dana', switched: true },
  { query: '543', switched: true },
  { query: '123', switched: true },
  { query: 'River', switched: false },
  { query: '456', switched: false },
])(
  'selects $query through login without opening messages',
  async ({ query, switched }) => {
    const client = scriptedRayuelaSession(
      ...rayuelaChildSelectionPages(
        `new PopUp('X_ALUMNO_123', 'Dána Example', '123', cambioHijo)`,
      ),
      ...(switched
        ? ['', `new PopUp('X_ALUMNO_789', 'River Example', '789', cambioHijo)`]
        : []),
      '<p>Timetable</p>',
    )
    expect(await fetchRayuelaPage(client, 'HoraAlumno', query)).toBe(
      '<p>Timetable</p>',
    )
    expect(client.request.mock.calls[1]?.[0]).toBe(
      'https://rayuela.educarex.es/modulo_acceso/controlador.rayuela;jsessionid=fake',
    )
    expect(client.request.mock.calls[1]?.[1]?.form).toMatchObject({
      usuario: 'synthetic-user',
      clave: 'synthetic-password',
      NORMAL: 'Entrar',
      tipo_acceso: 'NORMAL',
      nav_web_nombre: 'Chrome',
      nav_web_version: '140',
    })
    expect(client.request.mock.calls[6]?.[0]).toContain('COD_PAGINA=321')
    expect(
      client.request.mock.calls
        .map(([url]) => url)
        .filter((url) => url.includes('cambiaAlumnoDirecto.jsp')),
    ).toEqual(
      switched
        ? [
            'https://rayuela.educarex.es/segedu/jsp/cambiaAlumnoDirecto.jsp?alumnoSalto=123',
          ]
        : [],
    )
    expect(
      client.request.mock.calls.filter(([url]) => url.includes('Barra.jsp')),
    ).toHaveLength(switched ? 2 : 1)
    expect(client.request.mock.calls.at(-1)?.[0]).toContain('COD_PAGINA=456')
    expect(
      client.request.mock.calls.every(
        ([url, options]) =>
          !/detalleMensaje|PrincipalPPL/i.test(url) &&
          options?.defaultCharset === 'iso-8859-1',
      ),
    ).toBe(true)
  },
)
it('refuses the target page when the portal reports success without switching pupils', async () => {
  const navigation = `new PopUp('X_ALUMNO_123', 'Dána Example', '123', cambioHijo)`
  const client = scriptedRayuelaSession(
    ...rayuelaChildSelectionPages(navigation),
    '',
    navigation,
  )
  await expect(fetchRayuelaPage(client, 'HoraAlumno', '123')).rejects.toThrow(
    'Rayuela did not confirm the selected child',
  )
  expect(client.request.mock.calls.at(-1)?.[0]).toContain('Barra.jsp')
  expect(
    client.request.mock.calls.some(([url]) => url.includes('COD_PAGINA=456')),
  ).toBe(false)
})
it('fails before module selection when login is rejected', async () => {
  const request = vi
    .fn<HttpClient['request']>()
    .mockResolvedValueOnce({
      url: 'https://rayuela.educarex.es/modulo_acceso/',
      status: 200,
      headers: {},
      body: Buffer.alloc(0),
      text: '<form action="controlador.rayuela"></form>',
    })
    .mockResolvedValueOnce({
      url: 'https://rayuela.educarex.es/modulo_acceso/controlador.rayuela',
      status: 200,
      headers: {},
      body: Buffer.alloc(0),
      text: 'Login rejected',
    })
  await expect(
    openRayuelaSession({ request, cookie: () => undefined }),
  ).rejects.toThrow('Rayuela login failed')
  expect(request).toHaveBeenCalledTimes(2)
})
