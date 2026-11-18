import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { aeatPagos } from './aeatPagos'

vi.mock('../../certificate/certificateNifs', () => ({
  certificateNifs: () => ['00000000T'],
}))

vi.mock('../../aeat/payments/listAeatPayments', () => ({
  listAeatPayments: vi.fn(async (...args: unknown[]) => Promise.resolve(args)),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }

describe('aeatPagos', () => {
  it("refuses a NIF that is not the certificate's: MisPagos would list the holder's", async () => {
    await expect(
      aeatPagos.run(client, { nif: 'B00000000' }, identity),
    ).rejects.toThrow(/only the certificate holder's payments \(00000000T\)/)
  })

  it('reads the holder’s own payments', async () => {
    await expect(
      aeatPagos.run(client, { nif: '00000000T', out: '/tmp/out' }, identity),
    ).resolves.toEqual([client, '00000000T', '/tmp/out'])
  })
})
