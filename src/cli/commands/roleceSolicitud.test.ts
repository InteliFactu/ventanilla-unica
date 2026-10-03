import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { signingFixtures } from '../../rolece/fixtures/signingFixtures'
import { roleceSolicitud } from './roleceSolicitud'

const options = {
  nif: 'B00000000',
  comunidad: 'Extremadura',
  provincia: 'Cáceres',
  email: 'info@example.com',
}

describe('roleceSolicitud', () => {
  it('is a write command', () => {
    expect(roleceSolicitud.effect).toBe('write')
  })

  it('refuses a confirmed filing without --out before touching the network', async () => {
    const client = scriptedClient()
    await expect(
      roleceSolicitud.run(
        client,
        { ...options, confirmar: 'si' },
        signingFixtures.identity,
      ),
    ).rejects.toThrow('--out is required')
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('validates the options before any request', async () => {
    const client = scriptedClient()
    await expect(
      roleceSolicitud.run(client, { ...options, email: 'x' }),
    ).rejects.toThrow('--email must')
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
