import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { presentSelfAssessment } from './presentSelfAssessment'

const answer = (text: string): HttpResponse => ({
  status: 200,
  url: 'https://www1.agenciatributaria.gob.es/x',
  headers: {},
  body: Buffer.alloc(0),
  text,
})

const button = (uuid: string, attrs: string): string =>
  String.raw`['zul.wgt.Button','${uuid}',{${attrs}},{},[]]`
const page = [
  String.raw`dt:'z_d1'`,
  button('imp', "sclass:'cmd__importacion'"),
  button('val', "sclass:'cmd__validar'"),
  button('pre', "sclass:'cmd__aeatPresentarBorrador'"),
  button('pag', "id:'btnPagarModal',sclass:'btnPresentar'"),
].join(' ')
const correcto = String.raw`zclass:'lineasTablaErrores'},{},[['zul.wgt.Image','i',{tooltiptext:'Aviso'},{},[]],['zul.wgt.Label','a',{value:'1'},{},[]],['zul.wgt.Label','b',{value:'31190'},{},[]],['zul.wgt.Label','c',{value:'text'},{},[]]]`
const payment = [
  String.raw`['zul.inp.Textbox','res',{id:'ImporteResultado',_value:'-1.109,76'},{},[]]`,
  String.raw`['zul.inp.Combobox','fdp',{id:'formasDePago',_value:'A compensar'},{},[]]`,
  button('fe', "id:'boton',sclass:'cmd__firmarEnviar'"),
].join(' ')
const warning = `{id:'winAdvertenciaWarning'} ${button('wsi', "id:'wsi'")}`
const party = (value: string): string =>
  String.raw`['zul.wgt.Label','p',{sclass:'colorAzulCorp notraducir',value:'${value}'},{},[]]`
const dialog = (declarant: string): string =>
  [
    String.raw`{id:'ventanaDialogoFirma'}`,
    party('00000000T PERSONA DE PRUEBA'),
    party(`${declarant} EMPRESA DE PRUEBA`),
    String.raw`['zul.wgt.Label','d',{sclass:'dlgfir_decla',value:'<T303020251T0000> ${declarant}'},{},[]]`,
    String.raw`['zul.wgt.Checkbox','chk',{id:'chAceptar'},{},[]]`,
    button('env', "id:'btnAceptarEnvio',sclass:'firmarEnviar'"),
  ].join(' ')
const receipt = String.raw`zAu.send(new zk.Event(zk.Desktop._dt,'onPresenvali',[{"r":"1"}]))`
const presented = String.raw`['zul.wgt.Label','j',{value:'Justificante 3030000000000'},{},[]] '/wlpl/x.pdf'`

const fakeClient = (declarant: string) => {
  const clicks: Record<string, string> = {
    val: correcto,
    pag: payment,
    fe: warning,
    wsi: dialog(declarant),
    env: receipt,
  }
  const byCommand = (form: Record<string, string>): string => {
    if (form['cmd_0'] === 'onClick') return clicks[form['uuid_0'] ?? ''] ?? ''
    if (form['cmd_0'] === 'onPresenvali') return presented
    return correcto
  }
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options?: HttpRequestOptions) =>
      Promise.resolve(
        answer(
          url.includes('/CONT/index.zul?')
            ? page
            : byCommand(options?.form ?? {}),
        ),
      ),
  )
  return {
    client: { request, cookie: () => undefined } satisfies HttpClient,
    request,
  }
}

const holderPage = `<T30301000> CB12345678${'EMPRESA DE PRUEBA'.padEnd(80)}`
const file = Buffer.from(`<T303020251T0000><AUX>${holderPage}`, 'latin1')
const sent = (request: ReturnType<typeof fakeClient>['request']): unknown[] =>
  request.mock.calls.map(([, o]) => o?.form?.['uuid_0'] ?? o?.form?.['cmd_0'])

describe('presentSelfAssessment', () => {
  it('stops at the signature dialog and files nothing without confirmation', async () => {
    const { client, request } = fakeClient('B12345678')
    const result = await presentSelfAssessment(client, file, false)
    expect(result.executed).toBe(false)
    expect(result.plan).toEqual([
      'resultado -1.109,76, forma de pago A compensar',
      'signed by 00000000T PERSONA DE PRUEBA on behalf of B12345678 EMPRESA DE PRUEBA',
    ])
    expect(sent(request)).toEqual(
      expect.arrayContaining(['val', 'pag', 'fe', 'wsi']),
    )
    expect(sent(request)).not.toContain('chk')
    expect(sent(request)).not.toContain('env')
    expect(sent(request)).not.toContain('onPresenvali')
  })

  it('ticks Conforme, sends once and echoes onPresenvali when confirmed', async () => {
    const { client, request } = fakeClient('B12345678')
    const result = await presentSelfAssessment(client, file, true)
    expect(result.executed).toBe(true)
    expect(sent(request).filter((uuid) => uuid === 'env')).toHaveLength(1)
    const echo = request.mock.calls.find(
      ([, o]) => o?.form?.['cmd_0'] === 'onPresenvali',
    )?.[1]?.form
    expect(echo).toMatchObject({ data_0: '{"":[{"r":"1"}]}' })
    expect(echo).not.toHaveProperty('uuid_0')
    expect(result.receipt?.labels).toContain('Justificante 3030000000000')
    expect(result.receipt?.urls).toContain('/wlpl/x.pdf')
  })

  it('refuses to sign a dialog for another declarant', async () => {
    const { client, request } = fakeClient('A87654321')
    await expect(presentSelfAssessment(client, file, true)).rejects.toThrow(
      'signature dialog is for A87654321',
    )
    expect(sent(request)).not.toContain('env')
  })
})
