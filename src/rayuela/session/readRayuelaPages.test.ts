import { afterEach, expect, it, vi } from 'vitest'

import { listRayuelaAbsences } from '../absences/listRayuelaAbsences'
import { listRayuelaChildren } from '../children/listRayuelaChildren'
import { listRayuelaMessages } from '../messages/listRayuelaMessages'
import { listRayuelaTeachers } from '../teachers/listRayuelaTeachers'
import { readRayuelaTimetable } from '../timetable/readRayuelaTimetable'
import { fetchRayuelaPage } from './fetchers/fetchRayuelaPage'
import { rayuelaChildSelectionPages } from './fixtures/rayuelaChildSelectionPages'
import { scriptedRayuelaSession } from './fixtures/scriptedRayuelaSession'

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
          date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) as string,
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
    const client = scriptedRayuelaSession(
      `var c_${name}= 456; <div accion="('${name}','789','x')">`,
      html,
    )
    const result = await read(client)
    expect(result).toBeDefined()
    expect(result).toMatchObject(expected)
    expect(client.request.mock.calls).toHaveLength(6)
    expect(
      client.request.mock.calls.every(
        ([url]) => !/detalleMensaje|PrincipalPPL|cambiaAlumnoDirecto/.test(url),
      ),
    ).toBe(true)
    expect(client.request.mock.calls[5]?.[0]).toContain(
      'Principal.jsp?COD_PAGINA=456',
    )
  },
)

it.each([
  {
    query: 'missing',
    switcher: `new PopUp('X_ALUMNO_123', 'Example, Dana', '123', cambioHijo)`,
    reason: '543: Example, Dana',
  },
  {
    query: 'Dana',
    switcher: `new PopUp('X_ALUMNO_123', 'Example, Dana', '123', cambioHijo)
      new PopUp('X_ALUMNO_123', 'Example, River', '123', cambioHijo)`,
    reason: 'duplicate switcher id 123',
  },
  {
    query: 'River',
    switcher: `new PopUp('X_ALUMNO_123', 'Other, Pupil', '123', cambioHijo)`,
    reason: 'does not map to a distinct child',
  },
  {
    query: 'River',
    switcher: '',
    reason: 'current child cannot be identified',
  },
])(
  'refuses $reason before switching or reading a page',
  async ({ query, switcher, reason }) => {
    vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
    vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
    const client = scriptedRayuelaSession(
      ...rayuelaChildSelectionPages(switcher),
    )
    await expect(fetchRayuelaPage(client, 'HoraAlumno', query)).rejects.toThrow(
      reason,
    )
    expect(client.request.mock.calls).toHaveLength(7)
    expect(
      client.request.mock.calls.every(
        ([url]) => !/cambiaAlumnoDirecto|COD_PAGINA=456/.test(url),
      ),
    ).toBe(true)
  },
)
