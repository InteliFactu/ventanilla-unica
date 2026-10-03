import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { roleceEstado } from './roleceEstado'

describe('roleceEstado', () => {
  it('reads by default and refuses a bad NIF before any request', async () => {
    expect(roleceEstado.effect).toBeUndefined()
    const client = scriptedClient()
    await expect(
      roleceEstado.run(client, { nif: 'B00000001' }),
    ).rejects.toThrow('is not valid')
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
