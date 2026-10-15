import { afterEach, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { listRayuelaAbsences } from '../absences/listRayuelaAbsences'
import { listRayuelaChildren } from '../children/listRayuelaChildren'
import { listRayuelaMessages } from '../messages/listRayuelaMessages'
import { listRayuelaTeachers } from '../teachers/listRayuelaTeachers'
import { readRayuelaTimetable } from '../timetable/readRayuelaTimetable'
import { fetchRayuelaPage } from './fetchers/fetchRayuelaPage'

afterEach(() => {
  vi.unstubAllEnvs()
})

it.each([
  {
    name: 'DetDatMisHij',
    expected: [{ name: 'Dana Example' }],
    read: listRayuelaChildren,
    html: '<TABLE id="CONT">Nombre:&nbsp;<font class="columnaValor">Dana Example</font></TABLE>',
  },
  {
    name: 'RegMisMenPla',
    expected: {
      total: 201,
      messages: [
        {
          id: '987',
          from: 'Taylor Example',
          subject: 'News',
          body: 'Hello',
          dateText: 'Jueves',
          hasAttachments: true,
        },
      ],
    },
    read: listRayuelaMessages,
    html: `<font id="numero_registros">Registros: 1-1 de 201</font><TABLE class="TableData"><TR id="987"><TD><img src="../images/icosFile/adjunto.png"></TD><TD><div class='jsonLinea' style='display:none'>{&quot;ASUNTO&quot;:&quot;News&quot;,&quot;CUERPO_MENSAJE&quot;:&quot;&lt;p&gt;Hello&lt;/p&gt;&quot;}</div></TD><TD>Taylor Example</TD><TD onclick="detalleMensaje('987')">News</TD><TD>Jueves</TD></TR></TABLE>`,
  },
  {
    name: 'HoraAlumno',
    expected: { days: ['Lunes'], slots: [['09:00', 'Science']] },
    read: readRayuelaTimetable,
    html: '<TABLE class="TableData"><TR><TH></TH><TH>Lunes</TH></TR><TR><TD>09:00</TD><TD>Science</TD></TR></TABLE>',
  },
  {
    name: 'RegFalAsi',
    expected: [],
    read: listRayuelaAbsences,
    html: '<TABLE class="TableData"><TR><TH>Ausencia en</TH></TR></TABLE>',
  },
  {
    name: 'RegDatPro',
    expected: { teachers: [] },
    read: listRayuelaTeachers,
    html: '<TABLE class="TableData"><TR><TH>Materia-Actividad</TH></TR></TABLE>',
  },
])(
  'reads $name through the full password session without opening message details',
  async ({ name, read, html, expected }) => {
    vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
    vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
    const texts = [
      '<form action="controlador.rayuela;jsessionid=fake"></form>',
      'preparar-acceso-aplicacion SEGUIMIENTO_EDUCATIVO',
      `<input value='https://rayuela.educarex.es/segedu/jsp/EntradaDirectaUsuario.jsp?token=fake'>`,
      JSON.stringify({
        nombreVentana: 'w1',
        menu: 'Menu.jsp',
        barraNavegacion: 'Barra.jsp',
      }),
      `var c_${name}= 456; <div accion="('${name}','789','x')">`,
      html,
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
    const result = await read(client)
    expect(result).toBeDefined()
    expect(result).toMatchObject(expected)
    expect(request).toHaveBeenCalledTimes(6)
    expect(
      request.mock.calls.every(
        ([url]) => !/detalleMensaje|PrincipalPPL|cambiaAlumnoDirecto/.test(url),
      ),
    ).toBe(true)
    expect(request.mock.calls[5]?.[0]).toContain('Principal.jsp?COD_PAGINA=456')
  },
)

it('does not switch or read a page for an unknown pupil', async () => {
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
  const texts = [
    '<form action="controlador.rayuela"></form>',
    'preparar-acceso-aplicacion SEGUIMIENTO_EDUCATIVO',
    `<input value='https://rayuela.educarex.es/segedu/jsp/EntradaDirectaUsuario.jsp?token=fake'>`,
    JSON.stringify({
      nombreVentana: 'w1',
      menu: 'Menu.jsp',
      barraNavegacion: 'Barra.jsp',
    }),
    `var c_HoraAlumno= 456; <div accion="('HoraAlumno','789','x')">`,
    `new PopUp('X_ALUMNO_123', 'Example, Dana', '123', cambioHijo)`,
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
  await expect(
    fetchRayuelaPage(
      { request, cookie: () => undefined },
      'HoraAlumno',
      'missing',
    ),
  ).rejects.toThrow('123: Example, Dana')
  expect(request).toHaveBeenCalledTimes(6)
  expect(
    request.mock.calls.every(([url]) => !url.includes('cambiaAlumnoDirecto')),
  ).toBe(true)
})
