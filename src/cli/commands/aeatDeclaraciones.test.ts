import { describe, expect, it, vi } from 'vitest'

import { actAsAeatHolder } from '../../aeat/session/actAsAeatHolder'
import type { HttpClient } from '../../http/types/HttpClient'
import { aeatDeclaraciones } from './aeatDeclaraciones'

vi.mock('../../aeat/session/actAsAeatHolder', () => ({
  actAsAeatHolder: vi.fn(async () => Promise.resolve()),
}))

vi.mock('../../aeat/filings/listAeatFilings', () => ({
  listAeatFilings: vi.fn(async (...args: unknown[]) => Promise.resolve(args)),
}))

const client: HttpClient = {
  request: vi.fn<HttpClient['request']>(),
  cookie: () => undefined,
}

const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }

describe('aeatDeclaraciones', () => {
  it('acts for the asked holder before reading SCEJ', async () => {
    await aeatDeclaraciones.run(
      client,
      { nif: 'B00000000', nombre: 'ACME SL', modelo: '303', ejercicio: '2025' },
      identity,
    )
    expect(actAsAeatHolder).toHaveBeenCalledWith(
      client,
      identity,
      'B00000000',
      'ACME SL',
    )
  })

  it('requires the nif, the modelo and the ejercicio', async () => {
    await expect(
      aeatDeclaraciones.run(client, { nif: '1', modelo: '303' }),
    ).rejects.toThrow(/--nif, --modelo and --ejercicio are required/)
  })

  it('passes the query and the output directory through', async () => {
    await expect(
      aeatDeclaraciones.run(client, {
        nif: '12345678Z',
        modelo: '303',
        ejercicio: '2025',
        periodo: '1T',
        out: '/tmp/out',
      }),
    ).resolves.toEqual([
      client,
      '12345678Z',
      { modelo: '303', ejercicio: '2025', periodo: '1T' },
      '/tmp/out',
    ])
    expect(aeatDeclaraciones).toMatchObject({
      portal: 'aeat',
      action: 'declaraciones',
      options: ['nif', 'nombre', 'modelo', 'ejercicio', 'periodo'],
    })
  })
})
