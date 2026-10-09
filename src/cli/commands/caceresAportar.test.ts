import { describe, expect, it } from 'vitest'

import { fakeRegistryClient } from '../../sta/registry/fixtures/fakeRegistryClient'
import { caceresAportar } from './caceresAportar'

describe('caceresAportar', () => {
  it('is a write that needs the certificate and checks options first', async () => {
    expect([
      caceresAportar.portal,
      caceresAportar.action,
      caceresAportar.effect,
    ]).toEqual(['caceres', 'aportar', 'write'])
    await expect(
      caceresAportar.run(fakeRegistryClient([]), {}),
    ).rejects.toThrow('needs the holder certificate')
  })
})
