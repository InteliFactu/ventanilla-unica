import { describe, expect, it, vi } from 'vitest'

import { registerCarpetaThirdParty } from './registerCarpetaThirdParty'
import { validateThirdPartyIban } from './validators/validateThirdPartyIban'

describe('registerCarpetaThirdParty', () => {
  it('does not contact the bank, create a draft or sign without confirmation', async () => {
    const client = { request: vi.fn(), cookie: vi.fn() }
    await expect(
      registerCarpetaThirdParty(
        client,
        { cert: Buffer.alloc(0), key: Buffer.alloc(0) },
        { iban: 'ES0000000000000000001234', phone: '600000000' },
        { confirmed: false, outDir: '/unused' },
      ),
    ).resolves.toMatchObject({ executed: false, accountEnding: '1234' })
    expect(client.request).not.toHaveBeenCalled()
  })
  it('validates checksums and refuses injected or foreign account values', () => {
    expect(() => validateThirdPartyIban('ES0000000000000000000000')).toThrow(
      'checksum',
    )
    expect(() => validateThirdPartyIban('ES19" checked="checked')).toThrow(
      'Spanish',
    )
    expect(() => validateThirdPartyIban('FR1420041010050500013M02606')).toThrow(
      'Spanish',
    )
  })
})
