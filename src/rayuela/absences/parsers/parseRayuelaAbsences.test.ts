import { expect, it } from 'vitest'
import { parseRayuelaAbsences } from './parseRayuelaAbsences'

it('parseRayuelaAbsences reads synthetic portal markup and rejects unsupported input', () => {
  const table =
    '<TABLE class="TableData"><TR><TH>Fecha</TH><TH>Ausencia en</TH><TH>Retraso</TH><TH>Motivo</TH><TH>Notificada</TH></TR><TR><TD>01/10/2026</TD><TD>Morning</TD><TD>No</TD><TD>Illness</TD><TD>Yes</TD></TR></TABLE>'
  expect(parseRayuelaAbsences(table)).toEqual([
    {
      date: '01/10/2026',
      absenceIn: 'Morning',
      late: 'No',
      reason: 'Illness',
      notified: 'Yes',
    },
  ])
  expect(
    parseRayuelaAbsences(table.replace(/<TR><TD>[\s\S]*?<\/TR>/, '')),
  ).toEqual([])
  expect(
    parseRayuelaAbsences(
      'Estado de falta de asistencia:&nbsp;<select name="ESTADO"></select><H3>No existen datos</H3>',
    ),
  ).toEqual([])
  expect(() => parseRayuelaAbsences('')).toThrow('not found')
})
