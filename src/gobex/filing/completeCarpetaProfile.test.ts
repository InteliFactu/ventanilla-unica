import { describe, expect, it, vi } from 'vitest'

import { completeCarpetaProfile } from './completeCarpetaProfile'

const request = {
  phone: '600000000',
  email: 'owner@example.test',
  region: '13',
  province: '10',
  municipality: '10037',
}

describe('completeCarpetaProfile', () => {
  it('never creates a draft, signs or posts anything without explicit confirmation', async () => {
    const client = { request: vi.fn(), cookie: vi.fn() }
    const result = await completeCarpetaProfile(
      client,
      { cert: Buffer.alloc(0), key: Buffer.alloc(0) },
      request,
      { confirmed: false, outDir: '/unused' },
    )
    expect(result).toMatchObject({ executed: false })
    expect(client.request).not.toHaveBeenCalled()
  })
})
