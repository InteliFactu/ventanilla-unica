import { expect, it } from 'vitest'
import { parseRayuelaGrades } from './parseRayuelaGrades'

const selectors = (year: string) =>
  `<select name="C_ANNO"><option value="2025" ${year === '2025' ? 'selected="selected"' : ''}>2025-2026</option><option value="2026" ${year === '2026' ? 'selected="selected"' : ''}>2026-2027</option></select>` +
  '<select name="X_CENTRO"><option value="1" selected="selected">10000000 - Example School</option></select>' +
  '<select name="X_OFERTAMATRIG"><option value="-1">&nbsp;</option><option value="9" selected="selected">2º de Educación Primaria</option></select>'

it('parseRayuelaGrades reads a synthetic populated year', () => {
  const html =
    selectors('2025') +
    '<TD>Resultado de la promoción: &nbsp;<font class="columnaValor">Promociona</font></TD>' +
    '<TABLE border="0" class="TableData" align="CENTER"><TR><TH>Materia</TH><TH>Tipo</TH><TH>1ª EVAL. PRIMARIA</TH><TH>Ordinaria</TH></TR>' +
    '<TR><TD><font>Example&nbsp;Subject<br/>Two</font></TD><TD><font>Comunes</font></TD><TD><font>Notable </font></TD><TD><font>Sobresaliente </font></TD></TR>' +
    '<TR><TD><font>Other</font></TD><TD><font>Optativas</font></TD><TD><font> </font></TD><TD><font>Bien</font></TD></TR></TABLE>'
  expect(parseRayuelaGrades(html)).toEqual({
    academicYear: '2025-2026',
    academicYears: ['2025-2026', '2026-2027'],
    centre: '10000000 - Example School',
    course: '2º de Educación Primaria',
    promotion: 'Promociona',
    subjects: [
      {
        subject: 'Example Subject Two',
        type: 'Comunes',
        grades: [
          { evaluation: '1ª EVAL. PRIMARIA', grade: 'Notable' },
          { evaluation: 'Ordinaria', grade: 'Sobresaliente' },
        ],
      },
      {
        subject: 'Other',
        type: 'Optativas',
        grades: [
          { evaluation: '1ª EVAL. PRIMARIA', grade: '' },
          { evaluation: 'Ordinaria', grade: 'Bien' },
        ],
      },
    ],
  })
})

it('parseRayuelaGrades reads an empty year and rejects unsupported input', () => {
  const html =
    selectors('2026') +
    '<TD>Resultado de la promoción: &nbsp;<font class="columnaValor">&nbsp;</font></TD><H3>No existen datos</H3>'
  expect(parseRayuelaGrades(html)).toMatchObject({
    academicYear: '2026-2027',
    promotion: '',
    subjects: [],
  })
  expect(() => parseRayuelaGrades('')).toThrow('selector was not found')
  expect(() => parseRayuelaGrades(selectors('2026'))).toThrow(
    'table was not found',
  )
  expect(() => parseRayuelaGrades(html, '2025')).toThrow(
    'requested academic year',
  )
})
