import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { placspEstado } from './placspEstado'

describe('placspEstado', () => {
  it('reads by default and needs an e-mail before any request', async () => {
    expect(placspEstado.effect).toBeUndefined()
    const client = scriptedClient()
    await expect(placspEstado.run(client, { email: 'nope' })).rejects.toThrow(
      '--email is required',
    )
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
