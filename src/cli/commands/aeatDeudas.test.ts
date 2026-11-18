import { describe, expect, it, vi } from 'vitest'

import { sweepAeatDebts } from '../../aeat/debts/sweepAeatDebts'
import type { HttpClient } from '../../http/types/HttpClient'
import { aeatDeudas } from './aeatDeudas'

vi.mock('../../aeat/debts/sweepAeatDebts', () => ({ sweepAeatDebts: vi.fn() }))
vi.mock('../../certificate/certificateNifs', () => ({
  certificateNifs: () => ['00000000T'],
}))

const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('aeatDeudas', () => {
  it('describes itself as the aeat deudas command taking --nif', () => {
    expect(aeatDeudas.portal).toBe('aeat')
    expect(aeatDeudas.action).toBe('deudas')
    expect(aeatDeudas.options).toEqual(['nif'])
  })

  it('rejects a call with no --nif', async () => {
    await expect(aeatDeudas.run(client, {})).rejects.toThrow(
      '--nif is required',
    )
  })

  it('delegates to sweepAeatDebts with the client and the given NIF', async () => {
    const report = {
      nif: '12345678Z',
      debts: [],
      agreements: [],
      totals: { pendiente: 0, aIngresar: 0 },
    }
    vi.mocked(sweepAeatDebts).mockResolvedValueOnce(report)
    const result = await aeatDeudas.run(client, { nif: '12345678Z' })
    expect(sweepAeatDebts).toHaveBeenCalledWith(client, '12345678Z', true)
    expect(result).toBe(report)
  })

  it('skips the agreements for a NIF the certificate is not issued to', async () => {
    await aeatDeudas.run(client, { nif: 'B12345678' }, identity)
    expect(sweepAeatDebts).toHaveBeenLastCalledWith(client, 'B12345678', false)
  })
})
