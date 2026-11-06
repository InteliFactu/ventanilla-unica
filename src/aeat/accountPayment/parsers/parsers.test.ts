import { describe, expect, it } from 'vitest'

import { accountPaymentErrorHtml } from '../fixtures/accountPaymentErrorHtml'
import { accountPaymentFixture as fx } from '../fixtures/accountPaymentFixture'
import { accountPaymentFormHtml } from '../fixtures/accountPaymentFormHtml'
import { accountPaymentSuccessHtml } from '../fixtures/accountPaymentSuccessHtml'
import { collaboratingEntitiesHtml } from '../fixtures/collaboratingEntitiesHtml'
import { parseCertificateHolder } from './parseCertificateHolder'
import { parseCollaboratingEntities } from './parseCollaboratingEntities'
import { parsePaymentAlerts } from './parsePaymentAlerts'
import { parsePaymentNrc } from './parsePaymentNrc'

describe('account-payment parsers', () => {
  it('reads the adhered entities', () => {
    expect(parseCollaboratingEntities(collaboratingEntitiesHtml)).toEqual([
      { codigo: '1465', nombre: 'Banco Uno' },
      { codigo: '1583', nombre: 'Banco Dos Sucursal en España' },
    ])
  })

  it('reads the certificate holder printed outside the form', () => {
    expect(parseCertificateHolder(accountPaymentFormHtml)).toEqual({
      nif: fx.nif,
      nombre: fx.nombre,
    })
    expect(parseCertificateHolder('<p/>')).toBeUndefined()
  })

  it('reads every error without its "Ir a error" link', () => {
    expect(parsePaymentAlerts(accountPaymentErrorHtml)).toEqual([
      'Número de Justificante o importe erróneo o ausente. Tipo liquidación. Carácter de control 13 inválido para número de justificante [010000000001A].',
      'El campo banco tiene un formato erróneo.',
    ])
    expect(parsePaymentAlerts(accountPaymentFormHtml)).toEqual([])
  })

  it('reads the NRC that extends the justificante, and nothing else', () => {
    expect(parsePaymentNrc(accountPaymentSuccessHtml, fx.justificante)).toBe(
      fx.nrc,
    )
    expect(
      parsePaymentNrc('<p>999999999999ZXYZ123456</p>', fx.justificante),
    ).toBeUndefined()
  })
})
