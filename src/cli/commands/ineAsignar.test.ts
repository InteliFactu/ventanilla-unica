import { describe, expect, it, vi } from 'vitest'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { ineAsignar } from './ineAsignar'

const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }
const identity = {} as CertificateIdentity

describe('ineAsignar', () => {
  it('is a write command', () => {
    expect(ineAsignar.effect).toBe('write')
  })

  it('validates --orden and --clave first', async () => {
    await expect(
      ineAsignar.run(client, { clave: 'x' }, identity),
    ).rejects.toThrow(/--orden/)
    await expect(
      ineAsignar.run(client, { orden: '1005484700I' }, identity),
    ).rejects.toThrow(/--clave/)
  })

  it('only plans without confirmation, touching nothing', async () => {
    await expect(
      ineAsignar.run(
        client,
        { orden: '1005484700z', clave: 'secret', 'aviso-correo': 'si' },
        identity,
      ),
    ).resolves.toEqual({
      confirmed: false,
      numeroOrden: '1005484700Z',
      avisoCorreo: true,
      messages: [],
    })
    expect(request).not.toHaveBeenCalled()
  })
})
