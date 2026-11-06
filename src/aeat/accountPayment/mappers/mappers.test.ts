import { describe, expect, it } from 'vitest'

import { parseFirstForm } from '../../../html/parsers/parseFirstForm'
import { accountPaymentFixture as fx } from '../fixtures/accountPaymentFixture'
import { accountPaymentFormHtml } from '../fixtures/accountPaymentFormHtml'
import { accountPaymentSummaryHtml } from '../fixtures/accountPaymentSummaryHtml'
import { accountPaymentFinalForm } from './accountPaymentFinalForm'
import { accountPaymentFirstForm } from './accountPaymentFirstForm'
import { cccControlDigit } from './cccControlDigit'
import { ibanEntityCode } from './ibanEntityCode'
import { normalizeIban } from './normalizeIban'

const base = 'https://www1.agenciatributaria.gob.es/'
const request = {
  nif: fx.nif,
  modelo: fx.modelo,
  justificante: fx.justificante,
  importe: fx.importe,
  iban: fx.iban,
  confirm: true,
}

describe('account-payment mappers', () => {
  it('normalizes an IBAN and reads its entity', () => {
    expect(normalizeIban('es19 1583-0001')).toBe('ES1915830001')
    expect(ibanEntityCode(fx.iban)).toBe('1583')
  })

  it('computes CCC control digits, mapping 11 to 0 and 10 to 1', () => {
    expect(cccControlDigit('0015830001')).toBe(1)
    expect(cccControlDigit('0000012345')).toBe(8)
    expect(cccControlDigit('0000000000')).toBe(0)
    expect(cccControlDigit('0000000001')).toBe(5)
    expect(cccControlDigit('1000000000')).toBe(1)
  })

  it('fills the first step like the browser, without the unchecked boxes and the button', () => {
    const blank = parseFirstForm(accountPaymentFormHtml, base)
    if (!blank) throw new Error('fixture has no form')
    const form = accountPaymentFirstForm(blank, request, fx.nombre)
    expect(form.action).toBe(
      'https://www1.agenciatributaria.gob.es/wlpl/OVPP-PAGO/LiquidacionesCuenta',
    )
    expect(form.fields).toMatchObject({
      fAccion: '1',
      idcodOpe: '002',
      idmod: '010',
      idjus: fx.justificante,
      idnif: fx.nif,
      idape: fx.nombre,
      idimp: fx.importe,
      idiban: fx.iban,
      apoBloq: '0',
    })
    expect(Object.keys(form.fields)).not.toEqual(
      expect.arrayContaining(['checkIban']),
    )
    expect(form.fields).not.toHaveProperty('idAPO')
    expect(form.fields).not.toHaveProperty('CONF')
    expect(form.fields).not.toHaveProperty('nifCert')
  })

  it('submits the summary hidden fields only', () => {
    const summary = parseFirstForm(accountPaymentSummaryHtml, base)
    if (!summary) throw new Error('fixture has no form')
    const form = accountPaymentFinalForm(summary)
    expect(form.fields).toMatchObject({
      fAccion: '4',
      param: 'true',
      idAPO: '0',
    })
    expect(form.fields).not.toHaveProperty('conforme')
    expect(form.fields).not.toHaveProperty('CONF')
    expect(form.fields).not.toHaveProperty('CANCEL')
  })
})
