import { afterEach, expect, it, vi } from 'vitest'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from './fetchers/fetchRayuelaPage'
import { openRayuelaSession } from './openRayuelaSession'

afterEach(() => {
  vi.unstubAllEnvs()
})
it('logs in, resolves menu ids, switches the selected pupil and never opens messages', async () => {
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
  const texts = [
    `<form name="formulario" action="controlador.rayuela;jsessionid=fake"></form>`,
    'preparar-acceso-aplicacion SEGUIMIENTO_EDUCATIVO',
    `<input value='https://rayuela.educarex.es/segedu/jsp/EntradaDirectaUsuario.jsp?token=fake'>`,
    '\n\n' +
      JSON.stringify({
        nombreVentana: 'w1',
        menu: 'Menu.jsp',
        barraNavegacion: 'Barra.jsp',
      }),
    `var c_HoraAlumno= 456; <div accion="('HoraAlumno','789','x')">`,
    `new PopUp('X_ALUMNO_123', 'Example, Dana', '123', cambioHijo)`,
    '',
    '<p>Timetable</p>',
  ]
  const request = vi.fn<HttpClient['request']>().mockImplementation(
    async (url) =>
      await Promise.resolve({
        url:
          url === 'https://rayuela.educarex.es/'
            ? 'https://rayuela.educarex.es/modulo_acceso/'
            : url,
        status: 200,
        headers: {},
        body: Buffer.alloc(0),
        text: texts.shift() ?? '',
      }),
  )
  const client: HttpClient = { request, cookie: () => undefined }
  expect(await fetchRayuelaPage(client, 'HoraAlumno', 'dana')).toBe(
    '<p>Timetable</p>',
  )
  expect(request.mock.calls[1]?.[0]).toBe(
    'https://rayuela.educarex.es/modulo_acceso/controlador.rayuela;jsessionid=fake',
  )
  expect(request.mock.calls[1]?.[1]?.form).toMatchObject({
    usuario: 'synthetic-user',
    clave: 'synthetic-password',
    NORMAL: 'Entrar',
    tipo_acceso: 'NORMAL',
    nav_web_nombre: 'Chrome',
    nav_web_version: '140',
  })
  expect(request.mock.calls[6]?.[0]).toContain(
    'cambiaAlumnoDirecto.jsp?alumnoSalto=123',
  )
  expect(request.mock.calls[7]?.[0]).toContain('COD_PAGINA=456')
  expect(
    request.mock.calls.every(
      ([url, options]) =>
        !/detalleMensaje|PrincipalPPL/i.test(url) &&
        options?.defaultCharset === 'iso-8859-1',
    ),
  ).toBe(true)
})
it('fails before module selection when login is rejected', async () => {
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
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
