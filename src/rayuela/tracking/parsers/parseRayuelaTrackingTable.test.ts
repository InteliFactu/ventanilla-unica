import { expect, it } from 'vitest'

import { parseRayuelaTrackingTable } from './parseRayuelaTrackingTable'

it('retains the subject and group on every row covered by a span', () => {
  const page = `<TABLE class="TableData">
    <TR><TH>Materia</TH><TH>Grupo</TH><TH>Fecha</TH><TH>Nota</TH><TH>Observaciones</TH></TR>
    <TR><TD rowspan="2">Mathematics</TD><TD ROWSPAN='2'>Group A</TD><TD>13/11/2026</TD><TD>Good</TD><TD>First</TD></TR>
    <TR><TD>14/11/2026</TD><TD>Very good</TD><TD>&nbsp;</TD></TR>
    <TR><TD>History</TD><TD>Group B</TD><TD>15/11/2026</TD><TD>Good</TD><TD>New group</TD></TR>
  </TABLE>`
  expect(parseRayuelaTrackingTable(page)).toEqual({
    columns: ['Materia', 'Grupo', 'Fecha', 'Nota', 'Observaciones'],
    rows: [
      ['Mathematics', 'Group A', '13/11/2026', 'Good', 'First'],
      ['Mathematics', 'Group A', '14/11/2026', 'Very good', ''],
      ['History', 'Group B', '15/11/2026', 'Good', 'New group'],
    ],
  })
})

it('requires the explicit empty marker when the data table is absent', () => {
  expect(parseRayuelaTrackingTable('<h3>No existen datos</h3>')).toEqual({
    columns: [],
    rows: [],
  })
  expect(() => parseRayuelaTrackingTable('<p>No existen datos</p>')).toThrow(
    'data table was not found',
  )
})

it('rejects an incomplete group and a misaligned row', () => {
  expect(() =>
    parseRayuelaTrackingTable(
      '<TABLE class="TableData"><TR><TH>Materia</TH></TR><TR><TD rowspan="2">Mathematics</TD></TR></TABLE>',
    ),
  ).toThrow('extends beyond')
  expect(() =>
    parseRayuelaTrackingTable(
      '<TABLE class="TableData"><TR><TH>Materia</TH></TR><TR><TD>Mathematics</TD><TD>Extra</TD></TR></TABLE>',
    ),
  ).toThrow('unexpected cells')
})
