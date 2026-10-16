import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { registradoresNota } from './registradoresNota'

const options = {
  nif: 'B00000000',
  email: 'notas@example.com',
  telefono: '600000000',
}

describe('registradoresNota', () => {
  it('is a write command', () => {
    expect(registradoresNota.effect).toBe('write')
  })

  it('refuses an order without the billing address before any request', async () => {
    const client = scriptedClient()
    await expect(
      registradoresNota.run(client, { ...options, confirmar: 'si' }),
    ).rejects.toThrow('--direccion and --codigo-postal are required')
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
