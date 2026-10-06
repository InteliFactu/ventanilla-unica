import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { aeatInformativa } from './aeatInformativa'

vi.mock('../../aeat/bulkFiling/presentBulkFile', () => ({
  presentBulkFile: vi.fn(
    async (_client: unknown, query: unknown, context: unknown) =>
      Promise.resolve({ query, context }),
  ),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('aeatInformativa', () => {
  it('is a write command that passes the confirmation through', async () => {
    expect(aeatInformativa.effect).toBe('write')
    await expect(
      aeatInformativa.run(client, {
        fichero: 'f.txt',
        confirmar: 'si',
        out: 'd',
      }),
    ).resolves.toEqual({
      query: { fichero: 'f.txt', periodo: '0A' },
      context: { confirmed: true, outDir: 'd' },
    })
  })
})
