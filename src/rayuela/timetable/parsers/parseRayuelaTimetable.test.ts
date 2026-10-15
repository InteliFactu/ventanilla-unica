import { expect, it } from 'vitest'
import { parseRayuelaTimetable } from './parseRayuelaTimetable'

it('parseRayuelaTimetable reads synthetic portal markup and rejects unsupported input', () => {
  const table =
    '<TABLE class="TableData"><TR><TH></TH><TH>Lunes</TH><TH>Martes</TH></TR><TR><TD>09:00</TD><TD>SC<br>Room 1</TD><TD>Maths</TD></TR></TABLE><TABLE class="TableData"><TR><TD colspan="2" class="cabeceraTituloTabla">Legend</TD></TR><TR><TH>Abreviatura</TH><TH>Descripción</TH></TR><TR><TD>SC</TD><TD>Science</TD></TR></TABLE>'
  expect(parseRayuelaTimetable(table)).toEqual({
    days: ['Lunes', 'Martes'],
    slots: [['09:00', 'SC Room 1', 'Maths']],
    legend: [['SC', 'Science']],
  })
  expect(() => parseRayuelaTimetable('')).toThrow('not found')
})
