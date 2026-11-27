import { afterEach, describe, expect, it, vi } from 'vitest'

import { createHttpClient } from '../http/createHttpClient'
import { loadObligadoClient } from './loadObligadoClient'

vi.mock('../certificate/loadCertificateIdentity', () => ({
  loadCertificateIdentity: vi.fn(async () =>
    Promise.resolve({
      cert: Buffer.from(''),
      key: Buffer.from(''),
      passphrase: 'payer-fixture',
    }),
  ),
}))
vi.mock('../certificate/certificateNifs', () => ({
  certificateNifs: () => ['B00000000', '00000000T'],
}))

vi.mock('../http/createHttpClient', () => ({
  createHttpClient: vi.fn(() => ({
    request: vi.fn(),
    cookie: () => undefined,
  })),
}))

const paths = { 'cert-obligado': 'c.pem', 'key-obligado': 'k.pem' }

describe('loadObligadoClient', () => {
  afterEach(() => vi.unstubAllEnvs())
  it('is absent without the options', async () => {
    await expect(loadObligadoClient({}, 'B00000000')).resolves.toBeUndefined()
  })

  it('needs both paths', async () => {
    await expect(
      loadObligadoClient({ 'cert-obligado': 'c.pem' }, 'B00000000'),
    ).rejects.toThrow('go together')
  })

  it('refuses a certificate not issued for the obligado', async () => {
    await expect(loadObligadoClient(paths, 'A00000000')).rejects.toThrow(
      'not issued to or for the obligado A00000000',
    )
  })

  it('builds a client using the secondary passphrase', async () => {
    vi.stubEnv('VENTANILLA_UNICA_OBLIGADO_KEY_PASSPHRASE', 'obligado-fixture')
    const client = await loadObligadoClient(paths, 'B00000000')
    expect(client).toHaveProperty('request')
    expect(createHttpClient).toHaveBeenCalledWith(
      expect.objectContaining({ passphrase: 'obligado-fixture' }),
    )
  })
})
