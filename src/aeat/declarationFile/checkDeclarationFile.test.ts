import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { checkDeclarationFile } from './checkDeclarationFile'

const answer = (text: string): HttpResponse => ({
  status: 200,
  url: 'https://www1.agenciatributaria.gob.es/x',
  headers: {},
  body: Buffer.alloc(0),
  text,
})

const page = [
  String.raw`dt:'z_d1'`,
  String.raw`['zul.wgt.Button','lee',{id:'btnLeerDeclaracionUpl',upload:'true,maxsize=15000'},{},[]]`,
  String.raw`['zul.wgt.Button','pag',{id:'btnPagarModal',$onClick:true},{},[]]`,
  String.raw`['zul.wgt.Button','fir',{id:'boton',sclass:'cmd__firmarEnviar'},{},[]]`,
].join(' ')
const summary = String.raw`['zul.wgt.Label','a',{id:'SPNIF',value:'E00000059'},{},[]],['zul.wgt.Label','b',{id:'SPNOM',value:'EMPRESA ESPJ'},{},[]]`
const notice = (tooltip: string, code: string): string =>
  String.raw`zclass:'lineasTablaErrores'},{},[['zul.wgt.Image','i',{tooltiptext:'${tooltip}'},{},[]],['zul.wgt.Label','a',{value:'1'},{},[]],['zul.wgt.Label','b',{value:'${code}'},{},[]],['zul.wgt.Label','c',{value:'text'},{},[]]]`
const file = Buffer.from('<T390020250A0000><AUX>', 'latin1')

const fakeClient = (readAnswer: string) => {
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options?: HttpRequestOptions) => {
      if (url.endsWith('/CONT/index.zul?EDFI'))
        return Promise.resolve(answer(page))
      if (options?.form?.['cmd_0'] === 'onUpload')
        return Promise.resolve(answer(readAnswer))
      return Promise.resolve(answer(''))
    },
  )
  return {
    client: { request, cookie: () => undefined } satisfies HttpClient,
    request,
  }
}

describe('checkDeclarationFile', () => {
  it('reads the file on Envío Fichero and never signs or files', async () => {
    const { client, request } = fakeClient(summary)
    const result = await checkDeclarationFile(client, file)
    expect(result).toMatchObject({
      modelo: '390',
      ejercicio: '2025',
      periodo: '0A',
      holder: { nif: 'E00000059', nombre: 'EMPRESA ESPJ' },
      notices: [],
      valid: true,
    })
    const urls = request.mock.calls.map(([url]) => url)
    expect(urls[0]).toBe(
      'https://www1.agenciatributaria.gob.es/wlpl/PAIV-M390/E2025/CONT/index.zul?EDFI',
    )
    expect(urls[1]).toMatch(/\/PAIV-M390\/iwda\/zkau\/dropupload\?uuid=lee&/)
    expect(urls[2]).toBe(
      'https://www1.agenciatributaria.gob.es/wlpl/PAIV-M390/iwda/zkau',
    )
    expect(request).toHaveBeenCalledTimes(3)
    const pressed = request.mock.calls.map(([, o]) => o?.form?.['uuid_0'])
    expect(pressed).not.toContain('fir')
    expect(pressed).not.toContain('pag')
  })

  it('is not valid when the AEAT lists an error', async () => {
    const { client } = fakeClient(summary + notice('Error', 'E060061'))
    const result = await checkDeclarationFile(client, file)
    expect(result.valid).toBe(false)
    expect(result.notices).toEqual([
      { kind: 'error', line: '1', code: 'E060061', description: 'text' },
    ])
  })

  it('is not valid when the AEAT could not read the holder', async () => {
    const { client } = fakeClient(String.raw`{id:'SPNIF'},{},[]]`)
    const result = await checkDeclarationFile(client, file)
    expect(result).toMatchObject({ holder: undefined, valid: false })
  })

  it('refuses a model other than the 390', async () => {
    const { client } = fakeClient('')
    await expect(
      checkDeclarationFile(client, Buffer.from('<T303020251T0000>')),
    ).rejects.toThrow('only the 390')
  })
})
