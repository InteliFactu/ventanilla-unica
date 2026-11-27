import { expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPageResponse } from '../../rayuela/session/fetchers/fetchRayuelaPageResponse'
import { rayuelaMensajes } from './rayuelaMensajes'

vi.mock('../../rayuela/session/fetchers/fetchRayuelaPageResponse', () => ({
  fetchRayuelaPageResponse: vi.fn(),
}))

const responseUrl = 'https://rayuela.educarex.es/segedu/jsp/'
const preview = `<TD><div class='jsonLinea'>{&quot;ASUNTO&quot;:&quot;S&quot;,&quot;CUERPO_MENSAJE&quot;:&quot;B&quot;}</div></TD><TD>A</TD><TD>S</TD>`

it('filters the sent tray using exact numeric ids and keeps the portal total', async () => {
  vi.mocked(fetchRayuelaPageResponse).mockResolvedValueOnce(
    htmlResponse(
      responseUrl,
      `Registros: 1-2 de 3 <table>
    <tr id="9007199254740992">${preview}<TD>Jueves</TD></tr>
    <tr id="9007199254740993">${preview}<TD>Jueves</TD></tr>
    </table>`,
    ),
  )
  const client = {} as HttpClient
  expect(rayuelaMensajes.options).toContain('desde-id')
  const result = await rayuelaMensajes.run(client, {
    bandeja: 'ENV',
    'desde-id': '9007199254740992',
  })
  expect(fetchRayuelaPageResponse).toHaveBeenCalledWith(
    client,
    'RegMisMenPla',
    undefined,
    { BANDEJA: 'ENV' },
  )
  expect(result).toMatchObject({
    messages: [{ id: '9007199254740993' }],
    total: 3,
  })
})

it('rejects a non-decimal message id before fetching a tray', async () => {
  vi.mocked(fetchRayuelaPageResponse).mockClear()
  await expect(
    rayuelaMensajes.run({} as HttpClient, { 'desde-id': '0x42' }),
  ).rejects.toThrow('numeric message id')
  expect(fetchRayuelaPageResponse).not.toHaveBeenCalled()
})

it('reads the requested short last page before filtering by message id', async () => {
  const client = {} as HttpClient
  vi.mocked(fetchRayuelaPageResponse).mockResolvedValueOnce(
    htmlResponse(
      responseUrl,
      `Registros: 201-202 de 202 <table>
      <tr id="41">${preview}<TD>Jueves</TD></tr>
      <tr id="42">${preview}<TD>Jueves</TD></tr></table>`,
    ),
  )
  expect(rayuelaMensajes.options).toContain('pagina')
  const result = await rayuelaMensajes.run(client, {
    pagina: '2',
    'desde-id': '41',
  })
  expect(fetchRayuelaPageResponse).toHaveBeenCalledWith(
    client,
    'RegMisMenPla',
    undefined,
    { BANDEJA: 'REC', N_REG_EMPIEZA_PAG: '200' },
  )
  expect(result).toMatchObject({ messages: [{ id: '42' }], total: 202 })
})

it.each([
  'Registros: 1-200 de 400',
  'Registros: 201-200 de 200',
  'Registros: 400',
  'Registros: 201-400 de 400',
])('rejects an unverified later page with range %s', async (range) => {
  vi.mocked(fetchRayuelaPageResponse).mockResolvedValueOnce(
    htmlResponse(responseUrl, range),
  )
  await expect(
    rayuelaMensajes.run({} as HttpClient, { pagina: '2' }),
  ).rejects.toThrow('requested Rayuela message page')
})

it('rejects an unsafe page number before fetching a tray', async () => {
  vi.mocked(fetchRayuelaPageResponse).mockClear()
  await expect(
    rayuelaMensajes.run({} as HttpClient, { pagina: '9007199254740991' }),
  ).rejects.toThrow('--pagina')
  expect(fetchRayuelaPageResponse).not.toHaveBeenCalled()
})

it.each([
  ['Fri, 13 Nov 2026 22:59:30 GMT', '23:59', '2026-11-13'],
  ['Fri, 13 Nov 2026 23:00:30 GMT', 'Viernes', '2026-11-13'],
  [undefined, '23:59', null],
  ['Invalid Date', '23:59', null],
] as const)(
  'anchors relative dates across Madrid midnight with HTTP date %s',
  async (date, dateText, expected) => {
    vi.useFakeTimers({ now: new Date('2026-11-13T22:59:00Z') })
    vi.mocked(fetchRayuelaPageResponse).mockImplementationOnce(async () => {
      vi.setSystemTime(new Date('2026-11-13T23:01:00Z'))
      const response = htmlResponse(
        responseUrl,
        `Registros: 1 <table><tr id="42">${preview}<TD>${dateText}</TD></tr></table>`,
      )
      return Promise.resolve({ ...response, headers: { date } })
    })
    try {
      const result = await rayuelaMensajes.run({} as HttpClient, {})
      expect(result).toMatchObject({
        messages: [{ dateText, date: expected }],
      })
    } finally {
      vi.useRealTimers()
    }
  },
)
