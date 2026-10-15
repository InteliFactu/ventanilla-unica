import { expect, it } from 'vitest'
import { parseRayuelaTeachers } from './parseRayuelaTeachers'

it('parseRayuelaTeachers reads synthetic portal markup and rejects unsupported input', () => {
  const table =
    'Grupo:&nbsp;<font class="columnaValor">5B</font> Tutor/a:&nbsp;<font class="columnaValor">Taylor Example</font><TABLE class="TableData"><TR><TH>Materia-Actividad</TH><TH>Profesor</TH><TH>Horario de visitas</TH></TR><TR><TD>Science</TD><TD>Taylor Example</TD><TD>Monday<br>16:00</TD></TR></TABLE>'
  expect(parseRayuelaTeachers(table)).toEqual({
    group: '5B',
    tutor: 'Taylor Example',
    teachers: [
      {
        subject: 'Science',
        teacher: 'Taylor Example',
        visitingHours: 'Monday 16:00',
      },
    ],
  })
  expect(() => parseRayuelaTeachers('')).toThrow('not found')
})
