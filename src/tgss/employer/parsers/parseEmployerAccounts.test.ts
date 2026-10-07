import { describe, expect, it } from 'vitest'

import { parseEmployerAccounts } from './parseEmployerAccounts'

const row = (situation: string): string =>
  '<ccc>\n<SRAnumAut><![CDATA[123456]]></SRAnumAut>\n' +
  '<CC4cod><![CDATA[100000001]]></CC4cod>\n<CC3pro><![CDATA[28]]></CC3pro>\n' +
  '<fecSit><![CDATA[01/02/2024]]></fecSit>\n' +
  '<RAZrazSoc><![CDATA[EMPRESA DE PRUEBA SL        ]]></RAZrazSoc>\n' +
  `<CC2reg><![CDATA[0111]]></CC2reg>\n<sit><![CDATA[${situation}]]></sit>\n` +
  '<tip><![CDATA[PRIN]]></tip></ccc>'

describe('parseEmployerAccounts', () => {
  it('reads each account with its situation', () => {
    const xml = `<listaAutorizados TOTAL_FILAS="2">${row('BAJA')}${row('ALTA')}</listaAutorizados>`

    expect(parseEmployerAccounts(xml)).toEqual([
      {
        ccc: '0111 28 100000001',
        tipo: 'PRIN',
        situacion: 'BAJA',
        fechaSituacion: '01/02/2024',
        razonSocial: 'EMPRESA DE PRUEBA SL',
        autorizacionRed: '123456',
      },
      expect.objectContaining({ situacion: 'ALTA' }),
    ])
  })

  it('answers no accounts for a screen without rows', () => {
    expect(
      parseEmployerAccounts('<listaAutorizados TOTAL_FILAS="0"/>'),
    ).toEqual([])
  })
})
