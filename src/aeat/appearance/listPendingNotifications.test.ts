import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { listPendingNotifications } from './listPendingNotifications'

describe('listPendingNotifications', () => {
  it('accepts an explicit empty search result', async () => {
    const request = vi.fn<HttpClient['request']>().mockResolvedValue({
      status: 200,
      url: '',
      headers: {},
      body: Buffer.alloc(0),
      text: '<strong>No se han obtenido resultados para estos datos</strong>',
    })
    await expect(
      listPendingNotifications(
        { request, cookie: () => undefined },
        new Date(),
      ),
    ).resolves.toEqual([])
  })

  it('refuses a portal page with no results table or empty result marker', async () => {
    const request = vi.fn<HttpClient['request']>().mockResolvedValue({
      status: 200,
      url: '',
      headers: {},
      body: Buffer.alloc(0),
      text: '<main>Error de identificaci&oacute;n</main>',
    })
    await expect(
      listPendingNotifications(
        { request, cookie: () => undefined },
        new Date(),
      ),
    ).rejects.toThrow('unrecognized notification list')
  })

  it('asks for unread rows and drops any marked read', async () => {
    const html = [
      ['111111', 'No'],
      ['222222', 'S&iacute;'],
    ]
      .map(
        ([ncc = '', leida = ''], index) =>
          `<tr id='filaNum${String(index)}'><td><a href='DetalleSede?ncc=${ncc}'>x</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>${leida}</td></tr>`,
      )
      .join('')
    const request = vi.fn<HttpClient['request']>().mockResolvedValue({
      status: 200,
      url: '',
      headers: {},
      body: Buffer.alloc(0),
      text: html,
    })
    const rows = await listPendingNotifications(
      { request, cookie: () => undefined },
      new Date(2026, 8, 26),
    )
    expect(rows.map((row) => row.ncc)).toEqual(['111111'])
    expect(request.mock.calls[0]?.[1]?.form?.['F_LEIDA']).toBe('0')
  })
})
