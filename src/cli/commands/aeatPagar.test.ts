import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { aeatPagar } from './aeatPagar'

vi.mock('../../aeat/accountPayment/payByAccountDebit', () => ({
  payByAccountDebit: vi.fn(async (_client: unknown, request: unknown) =>
    Promise.resolve({ request }),
  ),
}))

const request = vi.fn<HttpClient['request']>()
const client: HttpClient = { request, cookie: () => undefined }
const valid = {
  nif: '00000000T',
  modelo: '010',
  justificante: '010000000001A',
  importe: '50,00',
  iban: 'ES1915830001180000012345',
}

describe('aeatPagar', () => {
  it('is a write command', () => {
    expect(aeatPagar.effect).toBe('write')
    expect(aeatPagar.description).toMatch(/charges nothing/)
  })

  it('refuses invalid options before any request', async () => {
    await expect(
      aeatPagar.run(client, { ...valid, iban: 'x' }),
    ).rejects.toThrow('--iban')
    expect(request).not.toHaveBeenCalled()
  })

  it('confirms only with --confirmar si', async () => {
    const planned = (await aeatPagar.run(client, valid)) as {
      request: { confirm: boolean }
    }
    expect(planned.request.confirm).toBe(false)
    const confirmed = (await aeatPagar.run(client, {
      ...valid,
      confirmar: 'si',
    })) as { request: { confirm: boolean } }
    expect(confirmed.request.confirm).toBe(true)
  })
})
