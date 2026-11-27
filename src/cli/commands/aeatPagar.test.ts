import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { loadObligadoClient } from '../loadObligadoClient'
import { aeatPagar } from './aeatPagar'

vi.mock('../../aeat/accountPayment/payByAccountDebit', () => ({
  payByAccountDebit: vi.fn(
    async (_client: unknown, request: unknown, obligado: unknown) =>
      Promise.resolve({ request, obligado }),
  ),
}))

vi.mock('../loadObligadoClient', () => ({ loadObligadoClient: vi.fn() }))

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

  it('passes a separate client for the validated obligado NIF', async () => {
    const obligado: HttpClient = { request: vi.fn(), cookie: () => undefined }
    vi.mocked(loadObligadoClient).mockResolvedValueOnce(obligado)
    const options = {
      ...valid,
      'cert-obligado': 'obligado.pem',
      'key-obligado': 'obligado.key',
    }
    await expect(aeatPagar.run(client, options)).resolves.toMatchObject({
      obligado,
    })
    expect(loadObligadoClient).toHaveBeenCalledWith(options, valid.nif)
  })
})
