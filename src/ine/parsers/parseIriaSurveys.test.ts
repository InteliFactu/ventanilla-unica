import { describe, expect, it } from 'vitest'

import { parseIriaSurveys } from './parseIriaSurveys'

const row = (index: number, name: string, pending: string): string =>
  `<tr data-ri="${String(index)}" class="ui-widget-content"><td role="gridcell" class=""><img alt="Existen cuestionarios pendientes" /></td><td role="gridcell" class=""></td><td role="gridcell" class=""></td><td role="gridcell" class="">${name}</td><td role="gridcell" class="hidden-sm d-none d-sm-block">${pending}</td><td role="gridcell" class="hidden-reflow"><input type="image" /></td></tr>`

describe('parseIriaSurveys', () => {
  it('reads each survey and whether it has questionnaires pending', () => {
    const html = `<table><tbody>${row(0, 'Encuesta Trimestral de Coste Laboral', 'Sí')}${row(1, 'Encuesta Anual de Estructura Salarial', 'No')}</tbody></table>`
    expect(parseIriaSurveys(html)).toEqual([
      {
        encuesta: 'Encuesta Trimestral de Coste Laboral',
        cuestionariosPendientes: true,
      },
      {
        encuesta: 'Encuesta Anual de Estructura Salarial',
        cuestionariosPendientes: false,
      },
    ])
  })

  it('returns nothing when the page is not the survey list', () => {
    expect(parseIriaSurveys('<html><body>Cuestionarios</body></html>')).toEqual(
      [],
    )
  })
})
