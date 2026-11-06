import { describe, expect, it } from 'vitest'

import { parseFirstForm } from '../../../html/parsers/parseFirstForm'
import { accountPaymentFixture as fx } from '../fixtures/accountPaymentFixture'
import { accountPaymentSummaryHtml } from '../fixtures/accountPaymentSummaryHtml'
import { accountPaymentBlockers } from './accountPaymentBlockers'
import { hasValidCccDigits } from './hasValidCccDigits'
import { isJustificanteText } from './isJustificanteText'
import { isPasarelaModelo } from './isPasarelaModelo'
import { isSpanishIban } from './isSpanishIban'
import { validateAccountPaymentRequest } from './validateAccountPaymentRequest'

const options = {
  nif: fx.nif,
  modelo: fx.modelo,
  justificante: fx.justificante,
  importe: fx.importe,
  iban: fx.iban,
}
const request = { ...options, confirm: false }
const summary = parseFirstForm(
  accountPaymentSummaryHtml,
  'https://www1.agenciatributaria.gob.es/',
)
const context = {
  holder: { nif: fx.nif, nombre: fx.nombre },
  entities: [{ codigo: '1583', nombre: 'Banco Dos' }],
  alerts: [],
  summary,
  paymentsChecked: true,
}

describe('account-payment validators', () => {
  it('checks the IBAN checksum and the CCC control digits', () => {
    expect(isSpanishIban(fx.iban)).toBe(true)
    expect(isSpanishIban('ES2015830001180000012345')).toBe(false)
    expect(isSpanishIban('DE89370400440532013000')).toBe(false)
    expect(hasValidCccDigits(fx.iban)).toBe(true)
    expect(hasValidCccDigits('ES8499990001000000000000')).toBe(false)
  })

  it('accepts the pasarela modelos and 13-character justificantes', () => {
    expect(isPasarelaModelo('010')).toBe(true)
    expect(isPasarelaModelo('303')).toBe(false)
    expect(isJustificanteText(fx.justificante)).toBe(true)
    expect(isJustificanteText('010000000001')).toBe(false)
  })

  it('validates the options offline and normalizes them', () => {
    expect(
      validateAccountPaymentRequest({
        ...options,
        justificante: fx.justificante.toLowerCase(),
        iban: 'es19 1583 0001 1800 0001 2345',
        confirmar: 'si',
        out: '/o',
      }),
    ).toEqual({ ...options, nombre: undefined, outDir: '/o', confirm: true })
    const fails =
      (patch: Record<string, string>): (() => unknown) =>
      () =>
        validateAccountPaymentRequest({ ...options, ...patch })
    expect(() => validateAccountPaymentRequest({})).toThrow('--nif')
    expect(fails({ nif: '00000000A' })).toThrow('--nif')
    expect(fails({ modelo: '303' })).toThrow('--modelo')
    expect(fails({ justificante: 'X' })).toThrow('--justificante')
    expect(fails({ importe: '0,00' })).toThrow('--importe')
    expect(fails({ importe: '50.00' })).toThrow('--importe')
    expect(fails({ iban: 'ES2015830001180000012345' })).toThrow('checksum')
    expect(fails({ iban: 'ES8499990001000000000000' })).toThrow(
      'control digits',
    )
  })

  it('has no blockers for a clean summary', () => {
    expect(accountPaymentBlockers(context, request)).toEqual([])
  })

  it('blocks a foreign entity, AEAT errors, a paid justificante and a summary that differs', () => {
    expect(
      accountPaymentBlockers(
        {
          ...context,
          entities: [],
          alerts: ['El campo banco tiene un formato erróneo.'],
          summary: undefined,
          paidNrc: fx.nrc,
        },
        request,
      ),
    ).toEqual([
      expect.stringMatching(/Entity 1583/),
      'AEAT: El campo banco tiene un formato erróneo.',
      expect.stringMatching(/already lists NRC/),
    ])
    expect(
      accountPaymentBlockers(context, { ...request, importe: '51,00' }),
    ).toEqual([expect.stringMatching(/idimp=50,00 instead of 51,00/)])
    expect(
      accountPaymentBlockers({ ...context, summary: undefined }, request),
    ).toEqual([expect.stringMatching(/neither the summary/)])
  })
})
