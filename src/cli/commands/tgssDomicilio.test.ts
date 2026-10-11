import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { tgssDomicilio } from './tgssDomicilio'

const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }
const options = {
  'tipo-via': 'CL',
  via: 'MAYOR',
  numero: '5',
  'codigo-postal': '28001',
  localidad: 'MADRID',
}

describe('tgssDomicilio', () => {
  it('is a write command that never submits, even with --confirmar si', async () => {
    expect(tgssDomicilio.effect).toBe('write')
    await expect(
      tgssDomicilio.run(client, { ...options, confirmar: 'si' }),
    ).rejects.toThrow(/cannot submit yet/)
    expect(request).not.toHaveBeenCalled()
  })
})
