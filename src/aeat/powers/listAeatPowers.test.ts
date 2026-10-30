import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { powerListPage } from './fixtures/powerListPage'
import { listAeatPowers } from './listAeatPowers'

const holder = 'B00000000'
const row = [
  '2020000000001',
  '00000000T',
  'GENERALDATPE',
  'Consulta de datos personales',
  'Todos',
  'Confirmado',
  '31-12-2030',
  'S',
]

const clientFor = (
  list: string,
): { client: HttpClient; request: ReturnType<typeof vi.fn> } => {
  const request = vi.fn(async (url: string): Promise<HttpResponse> => {
    const text = url.endsWith('/MdcAcceso') ? '' : list
    return Promise.resolve({
      status: 200,
      url,
      headers: {},
      body: Buffer.from(text),
      text,
    })
  })
  return { client: { request, cookie: () => undefined }, request }
}

describe('listAeatPowers', () => {
  it('reads an empty granted list as no powers, posting the search button', async () => {
    const { client, request } = clientFor(powerListPage(holder, []))
    await expect(listAeatPowers(client, holder, 'granted')).resolves.toEqual({
      nif: holder,
      direction: 'granted',
      count: 0,
      powers: [],
    })
    const [url, options] = request.mock.calls[1] as [string, HttpRequestOptions]
    expect(url).toMatch(/ITTI-APOD\/SvApodPoderQuery$/)
    expect(options.form).toMatchObject({
      VEZ: 'BUSCAR1',
      FORM_NIF_APODERADO: '',
    })
  })

  it('keys every cell by the label of its column', async () => {
    const { client, request } = clientFor(powerListPage(holder, [row]))
    const report = await listAeatPowers(client, holder, 'received')
    expect(report.powers[0]).toMatchObject({
      'Núm. Referencia': '2020000000001',
      'NIF / CIF Apoderado': '00000000T',
      Trámite: 'GENERALDATPE',
      Vigente: 'S',
    })
    expect(request.mock.calls[1]?.[0]).toMatch(/SvApodApodeQuery$/)
  })

  it('refuses a list for another holder', async () => {
    const { client } = clientFor(powerListPage('C00000000', []))
    await expect(listAeatPowers(client, holder, 'granted')).rejects.toThrow(
      'belongs to C00000000',
    )
  })

  it('refuses a page that is neither empty nor a list', async () => {
    const page = powerListPage(holder, []).replace(
      'No se han obtenido',
      'Error',
    )
    const { client } = clientFor(page)
    await expect(listAeatPowers(client, holder, 'granted')).rejects.toThrow(
      'neither empty nor a list',
    )
  })

  it('refuses a full page it cannot see past', async () => {
    const { client } = clientFor(
      powerListPage(
        holder,
        Array.from({ length: 10 }, () => row),
      ),
    )
    await expect(listAeatPowers(client, holder, 'granted')).rejects.toThrow(
      'next pages are not read yet',
    )
  })
})
