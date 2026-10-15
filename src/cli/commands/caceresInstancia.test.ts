import { describe, expect, it, vi } from 'vitest'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { caceresInstancia } from './caceresInstancia'

const identity = {} as CertificateIdentity

describe('caceresInstancia', () => {
  it('checks the options before any request', async () => {
    const request = vi.fn<HttpClient['request']>()
    const client = { request, cookie: () => undefined }
    await expect(
      caceresInstancia.run(client, { documentos: 'a.pdf' }, identity),
    ).rejects.toThrow('--asunto is required; --filas')
    expect(request).not.toHaveBeenCalled()
  })

  it('refuses --confirmar si before any request', async () => {
    const request = vi.fn<HttpClient['request']>()
    await expect(
      caceresInstancia.run(
        { request, cookie: () => undefined },
        {
          asunto: 'a',
          documentos: 'a.pdf',
          filas: 'Instancia General',
          confirmar: 'si',
        },
        identity,
      ),
    ).rejects.toThrow('Nothing was sent')
    expect(request).not.toHaveBeenCalled()
  })
})
