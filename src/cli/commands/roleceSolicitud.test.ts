import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
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

  it('refuses a confirmed filing without touching the network', async () => {
    const client = scriptedClient()
    await expect(
      roleceSolicitud.run(client, { ...options, confirmar: 'si' }),
    ).rejects.toThrow('cannot file yet')
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
