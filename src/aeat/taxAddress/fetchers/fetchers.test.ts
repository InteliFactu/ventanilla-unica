import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchM036Form } from './fetchM036Form'
import { postM036Event } from './postM036Event'

const answer = (
  status: number,
): Awaited<ReturnType<HttpClient['request']>> => ({
  status,
  url: '',
  headers: {},
  body: Buffer.alloc(0),
  text: 'zk',
})

describe('036 fetchers', () => {
  it('GETs index.zul and refuses a failed load', async () => {
    const ok = vi.fn<HttpClient['request']>().mockResolvedValue(answer(200))
    expect(await fetchM036Form({ request: ok, cookie: () => undefined })).toBe(
      'zk',
    )
    expect(ok.mock.calls[0]?.[0]).toBe(
      'https://www1.agenciatributaria.gob.es/wlpl/BU36-M036/MOD036/index.zul',
    )
    const failed = vi.fn<HttpClient['request']>().mockResolvedValue(answer(403))
    await expect(
      fetchM036Form({ request: failed, cookie: () => undefined }),
    ).rejects.toThrow('HTTP 403')
  })

  it('POSTs a desktop-level event without uuid_0', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValue(answer(200))
    await postM036Event({ request, cookie: () => undefined }, 'z_1', {
      cmd: 'onPresenvali',
      data: { '': [{ kls: 'K1' }] },
    })
    expect(request.mock.calls[0]?.[1]?.form).toEqual({
      dtid: 'z_1',
      cmd_0: 'onPresenvali',
      data_0: '{"":[{"kls":"K1"}]}',
    })
  })

  it('POSTs a zkau event in browser field order', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValue(answer(200))
    await postM036Event({ request, cookie: () => undefined }, 'z_1', {
      cmd: 'onCheck',
      uuid: 'u1',
      data: { '': true },
    })
    expect(request.mock.calls[0]?.[0]).toBe(
      'https://www1.agenciatributaria.gob.es/wlpl/BU36-M036/zkau',
    )
    expect(request.mock.calls[0]?.[1]?.form).toEqual({
      dtid: 'z_1',
      cmd_0: 'onCheck',
      uuid_0: 'u1',
      data_0: '{"":true}',
    })
  })
})
