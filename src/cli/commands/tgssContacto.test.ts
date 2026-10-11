import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { tgssContacto } from './tgssContacto'

const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }

describe('tgssContacto', () => {
  it('is a write command that validates before any request', async () => {
    expect(tgssContacto.effect).toBe('write')
    await expect(
      tgssContacto.run(client, { correo: 'a@b.es' }),
    ).rejects.toThrow(/--movil/)
    expect(request).not.toHaveBeenCalled()
  })
})
