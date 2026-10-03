import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { filingReceiptHtml } from '../fixtures/filingReceiptHtml'
import { readFilingAnswer } from './readFilingAnswer'

describe('readFilingAnswer', () => {
  it('recognises the acuse de recibo and its expediente', () => {
    const answer = readFilingAnswer(htmlResponse('u', filingReceiptHtml))
    expect(answer).toMatchObject({
      filed: true,
      registro: 'ROLECE2026E000000001',
      expediente: String.raw`2026\000123`,
    })
    expect(answer.summary).toContain('ACUSE DE RECIBO')
  })
  it('does not call an error or the unsigned draft filed', () => {
    expect(
      readFilingAnswer(htmlResponse('u', '<p>Error de firma</p>')).filed,
    ).toBe(false)
    expect(
      readFilingAnswer(htmlResponse('u', '<h1>Acuse de recibo sin número</h1>'))
        .filed,
    ).toBe(false)
  })
})
