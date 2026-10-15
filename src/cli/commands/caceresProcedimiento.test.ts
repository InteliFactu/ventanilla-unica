import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { caceresProcedimiento } from './caceresProcedimiento'

describe('caceresProcedimiento', () => {
  it('refuses a malformed dboid before any request', async () => {
    const request = vi.fn<HttpClient['request']>()
    await expect(
      caceresProcedimiento.run(
        { request, cookie: () => undefined },
        { dboid: '123' },
      ),
    ).rejects.toThrow('--dboid')
    expect(request).not.toHaveBeenCalled()
  })
})
