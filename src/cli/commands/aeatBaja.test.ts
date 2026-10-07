import { describe, expect, it, vi } from 'vitest'

import { deregisterEntity } from '../../aeat/deregistration/deregisterEntity'
import type { HttpClient } from '../../http/types/HttpClient'
import { aeatBaja } from './aeatBaja'

vi.mock('../../aeat/deregistration/deregisterEntity', () => ({
  deregisterEntity: vi.fn(async () => Promise.resolve({ executed: false })),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('aeatBaja', () => {
  it('maps the options into a baja request', async () => {
    await aeatBaja.run(client, {
      nif: 'e00000000',
      fecha: '31/10/2026',
      sucesores: '11111111H;GARCIA ANA;50;0,00',
      lugar: 'Madrid',
      firmado: 'GARCIA ANA',
      calidad: 'Representante',
      validar: 'si',
    })
    expect(vi.mocked(deregisterEntity).mock.lastCall?.[1]).toMatchObject({
      nif: 'E00000000',
      causa: 'disolucion',
      validate: true,
      confirm: false,
      sucesores: [expect.objectContaining({ nif: '11111111H' })],
    })
  })

  it('requires --nif and a known --causa', async () => {
    await expect(aeatBaja.run(client, {})).rejects.toThrow(/--nif/)
    await expect(
      aeatBaja.run(client, { nif: 'E00000000', causa: 'fusion' }),
    ).rejects.toThrow(/--causa/)
  })
})
