import { describe, expect, it, vi } from 'vitest'

import { actAsAeatHolder } from '../../aeat/session/actAsAeatHolder'
import type { HttpClient } from '../../http/types/HttpClient'
import { aeatExpedientes } from './aeatExpedientes'

vi.mock('../../aeat/session/actAsAeatHolder', () => ({
  actAsAeatHolder: vi.fn(async () => Promise.resolve()),
}))

vi.mock('../../aeat/expedientes/listAeatExpedientes', () => ({
  listAeatExpedientes: vi.fn(async (...args: unknown[]) =>
    Promise.resolve(args),
  ),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }

describe('aeatExpedientes', () => {
  it('acts for the asked holder, then lists its expedientes', async () => {
    await expect(
      aeatExpedientes.run(
        client,
        { nif: 'B00000000', nombre: 'ACME SL' },
        identity,
      ),
    ).resolves.toEqual([client, 'B00000000'])
    expect(actAsAeatHolder).toHaveBeenCalledWith(
      client,
      identity,
      'B00000000',
      'ACME SL',
    )
  })

  it('requires the nif', async () => {
    await expect(aeatExpedientes.run(client, {})).rejects.toThrow(
      '--nif is required',
    )
  })
})
