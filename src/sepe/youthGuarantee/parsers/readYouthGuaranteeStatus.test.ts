import { describe, expect, it } from 'vitest'

import { youthGuaranteePage } from '../fixtures/youthGuaranteePage'
import { readYouthGuaranteeStatus } from './readYouthGuaranteeStatus'

describe('registration evidence', () => {
  it.each(['alta', 'baja', 'pendiente'] as const)(
    'reads an explicit %s and its registration date',
    (state) => {
      expect(
        readYouthGuaranteeStatus(
          `<dl><dt>Estado de inscripción:</dt><dd>${state}</dd><dt>Fecha de inscripción:</dt><dd>02/03/2024</dd></dl>`,
        ),
      ).toMatchObject({
        state,
        inscribed: state === 'pendiente' ? null : true,
        registrationDate: '02/03/2024',
      })
    },
  )
  it('recognizes the initial unconsolidated wizard', () => {
    expect(readYouthGuaranteeStatus(youthGuaranteePage(1))).toMatchObject({
      inscribed: false,
      state: 'not-inscribed',
    })
  })
  it('does not infer absence from a generic form or a missing certificate', () => {
    expect(
      readYouthGuaranteeStatus('<h1>DECLARACIÓN RESPONSABLE</h1>'),
    ).toMatchObject({ inscribed: null, state: 'unknown' })
  })
  it('does not call a consolidated application unregistered', () => {
    expect(
      readYouthGuaranteeStatus(
        youthGuaranteePage(1).replace(
          'name="tieneSolicitudConsolidada" value=""',
          'name="tieneSolicitudConsolidada" value="true"',
        ),
      ),
    ).toMatchObject({ state: 'unknown' })
  })
  it('ignores commented examples of registration', () => {
    expect(
      readYouthGuaranteeStatus(
        '<!-- Estado: alta Fecha de inscripción: 02/03/2024 -->',
      ),
    ).toMatchObject({ state: 'unknown', registrationDate: null })
  })

  it('ignores a commented initial draft when classifying the live page', () => {
    expect(
      readYouthGuaranteeStatus(`<!-- ${youthGuaranteePage(1)} -->`),
    ).toMatchObject({ state: 'unknown', inscribed: null })
  })
})
