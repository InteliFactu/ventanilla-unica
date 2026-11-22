import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { presentDeclarationFile } from './presentDeclarationFile'

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
  button('lee', "id:'btnLeerDeclaracionUpl',upload:'true,maxsize=15000'"),
  button('pag', "id:'btnPagarModal'"),
  button('fe', "id:'boton',sclass:'cmd__firmarEnviar'"),
].join(' ')
const summary = (nif: string): string =>
  String.raw`['zul.wgt.Label','a',{id:'SPNIF',value:'${nif}'},{},[]],['zul.wgt.Label','b',{id:'SPNOM',value:'EMPRESA ESPJ'},{},[]]`
const errorNotice = String.raw`zclass:'lineasTablaErrores'},{},[['zul.wgt.Image','i',{tooltiptext:'Error'},{},[]],['zul.wgt.Label','a',{value:'1'},{},[]],['zul.wgt.Label','b',{value:'E060061'},{},[]],['zul.wgt.Label','c',{value:'text'},{},[]]]`
const party = (value: string): string =>
  String.raw`['zul.wgt.Label','p',{sclass:'colorAzulCorp notraducir',value:'${value}'},{},[]]`
const dialog = (declarant: string): string =>
  [
    String.raw`{id:'ventanaDialogoFirma'}`,
    party('00000000T PERSONA DE PRUEBA'),
    party(`${declarant} EMPRESA ESPJ`),
    String.raw`['zul.wgt.Label','d',{sclass:'dlgfir_decla',value:'<T390020250A0000> ${declarant}'},{},[]]`,
    String.raw`['zul.wgt.Checkbox','chk',{id:'chAceptar'},{},[]]`,
    button('env', "id:'btnAceptarEnvio',sclass:'firmarEnviar'"),
  ].join(' ')
const receipt = String.raw`zAu.send(new zk.Event(zk.Desktop._dt,'onPresenvali',[{"r":"1"}]))`
const presented = String.raw`['zul.wgt.Label','j',{value:'Justificante 3900000000000'},{},[]] '/wlpl/x.pdf'`

const fakeClient = (read: string, declarant: string) => {
  const clicks: Record<string, string> = { fe: dialog(declarant), env: receipt }
  const byCommand = (form: Record<string, string>): string => {
    if (form['cmd_0'] === 'onUpload') return read
    if (form['cmd_0'] === 'onClick') return clicks[form['uuid_0'] ?? ''] ?? ''
    if (form['cmd_0'] === 'onPresenvali') return presented
    return ''
  }
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options?: HttpRequestOptions) =>
      Promise.resolve(
        answer(
          url.endsWith('/CONT/index.zul?EDFI')
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

const file = Buffer.from('<T390020250A0000><AUX>', 'latin1')
const sent = (request: ReturnType<typeof fakeClient>['request']): unknown[] =>
  request.mock.calls.map(([, o]) => o?.form?.['uuid_0'] ?? o?.form?.['cmd_0'])

describe('presentDeclarationFile', () => {
  it('reads the file, opens the signature dialog and files nothing without confirmation', async () => {
    const { client, request } = fakeClient(summary('E67686287'), 'E67686287')
    const result = await presentDeclarationFile(client, file, false)
    expect(result).toMatchObject({
      action: 'file AEAT modelo 390 2025 of E67686287 EMPRESA ESPJ',
      executed: false,
      plan: [
        'signed by 00000000T PERSONA DE PRUEBA on behalf of E67686287 EMPRESA ESPJ',
      ],
    })
    expect(sent(request)).toContain('fe')
    expect(sent(request)).not.toContain('pag')
    expect(sent(request)).not.toContain('chk')
    expect(sent(request)).not.toContain('env')
    expect(sent(request)).not.toContain('onPresenvali')
  })

  it('ticks Conforme, sends once and echoes onPresenvali when confirmed', async () => {
    const { client, request } = fakeClient(summary('E67686287'), 'E67686287')
    const result = await presentDeclarationFile(client, file, true)
    expect(result.executed).toBe(true)
    expect(sent(request).filter((uuid) => uuid === 'env')).toHaveLength(1)
    expect(sent(request)).toContain('onPresenvali')
    expect(result.receipt?.labels).toContain('Justificante 3900000000000')
    expect(result.receipt?.urls).toContain('/wlpl/x.pdf')
  })

  it('stops before the signature dialog when the AEAT lists an error', async () => {
    const { client, request } = fakeClient(
      summary('E67686287') + errorNotice,
      'E67686287',
    )
    const result = await presentDeclarationFile(client, file, true)
    expect(result).toMatchObject({ executed: false, plan: [] })
    expect(result.notes).toEqual(['error E060061 text'])
    expect(sent(request)).not.toContain('fe')
  })

  it('refuses to sign a dialog for another declarant', async () => {
    const { client, request } = fakeClient(summary('E67686287'), 'A87654321')
    await expect(presentDeclarationFile(client, file, true)).rejects.toThrow(
      'signature dialog is for A87654321',
    )
    expect(sent(request)).not.toContain('env')
  })
})
