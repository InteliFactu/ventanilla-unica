import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { dryRunSelfAssessment } from './dryRunSelfAssessment'

const answer = (text: string): HttpResponse => ({
  status: 200,
  url: 'https://www1.agenciatributaria.gob.es/x',
  headers: {},
  body: Buffer.alloc(0),
  text,
})

const button = (uuid: string, sclass: string): string =>
  String.raw`['zul.wgt.Button','${uuid}',{sclass:'${sclass}'},{},[]]`
const page = [
  String.raw`dt:'z_d1'`,
  button('imp', 'cmd__importacion'),
  button('val', 'cmd__validar'),
  button('pre', 'cmd__aeatPresentarBorrador'),
  button('sav', 'cmd__aeatGuardarBd'),
  button('fil', 'btnPresentar'),
].join(' ')
const notice = (tooltip: string, code: string): string =>
  String.raw`zclass:'lineasTablaErrores'},{},[['zul.wgt.Image','i',{tooltiptext:'${tooltip}'},{},[]],['zul.wgt.Label','a',{value:'1'},{},[]],['zul.wgt.Label','b',{value:'${code}'},{},[]],['zul.wgt.Label','c',{value:'text'},{},[]]]`
const holderPage = `<T30301000> CB12345678${'EMPRESA DE PRUEBA'.padEnd(80)}`
const file = Buffer.from(`<T303020251T0000><AUX>${holderPage}`, 'latin1')

const fakeClient = (importAnswer: string) => {
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options?: HttpRequestOptions) => {
      if (url.includes('/CONT/index.zul?')) return Promise.resolve(answer(page))
      if (options?.form?.['cmd_0'] === 'onUpload')
        return Promise.resolve(answer(importAnswer))
      if (options?.form?.['cmd_0'] === 'onClick')
        return Promise.resolve(answer(notice('Correcto', '00000')))
      return Promise.resolve(answer(''))
    },
  )
  return {
    client: { request, cookie: () => undefined } satisfies HttpClient,
    request,
  }
}

describe('dryRunSelfAssessment', () => {
  it('identifies the holder, imports, validates and never saves or files', async () => {
    const { client, request } = fakeClient(notice('Aviso', '31190'))
    const result = await dryRunSelfAssessment(client, file)
    expect(result).toMatchObject({
      modelo: '303',
      ejercicio: '2025',
      periodo: '1T',
      nif: 'B12345678',
      nombre: 'EMPRESA DE PRUEBA',
      imported: true,
      validated: true,
    })
    const census = request.mock.calls.find(([, o]) => o?.method === 'POST')
    expect(census?.[1]?.form).toMatchObject({
      NIF: 'B12345678',
      EJERCICIO: '2025',
      PERIODO: '1T',
      ORIGEN: 'PRE303',
    })
    expect(
      request.mock.calls.every(([url]) =>
        url.startsWith('https://www1.agenciatributaria.gob.es/'),
      ),
    ).toBe(true)
    const pressed = request.mock.calls.map(([, o]) => o?.form?.['uuid_0'])
    expect(pressed).toContain('val')
    expect(pressed).not.toContain('sav')
    expect(pressed).not.toContain('fil')
  })

  it('does not validate when the import raised an error', async () => {
    const { client, request } = fakeClient(notice('Error', 'FRECH'))
    const result = await dryRunSelfAssessment(client, file)
    expect(result).toMatchObject({ imported: false, validated: false })
    expect(
      request.mock.calls.some(([, o]) => o?.form?.['cmd_0'] === 'onClick'),
    ).toBe(false)
  })

  it('refuses a model other than the 303', async () => {
    const { client } = fakeClient('')
    await expect(
      dryRunSelfAssessment(client, Buffer.from('<T390020250A0000>')),
    ).rejects.toThrow('only the 303')
  })
})
