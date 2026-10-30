import { describe, expect, it, vi } from 'vitest'

import { readVehicles } from '../../dgt/vehicles/readVehicles'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dgtVehiculos } from './dgtVehiculos'

vi.mock('../../dgt/vehicles/readVehicles')

describe('dgt vehiculos', () => {
  it('reads the vehicles and stays read-only', async () => {
    const client = scriptedClient()
    await dgtVehiculos.run(client, {})
    expect(readVehicles).toHaveBeenCalledWith(client)
    expect(dgtVehiculos.effect).toBeUndefined()
  })
})
