import { describe, expect, it, vi } from 'vitest'

import { listRegistryEntries } from '../../carpeta/registries/listRegistryEntries'
import { carpetaRegistros } from './carpetaRegistros'

vi.mock('../../carpeta/registries/listRegistryEntries', () => ({
  listRegistryEntries: vi.fn(),
}))

describe('carpetaRegistros', () => {
  it('passes the parsed query through', async () => {
    expect(carpetaRegistros.action).toBe('registros')
    const client = { request: vi.fn(), cookie: () => undefined }
    await carpetaRegistros.run(client, {
      desde: '01/10/2026',
      hasta: '05/10/2026',
      registro: 'REGAGE26e00000000001',
    })
    expect(listRegistryEntries).toHaveBeenLastCalledWith(client, {
      from: new Date('2026-09-30T22:00:00.000Z'),
      to: new Date('2026-10-05T21:59:59.999Z'),
      number: 'REGAGE26e00000000001',
    })
  })
})
