import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { tgssAutorizadoNaf } from './tgssAutorizadoNaf'

vi.mock('../../tgss/nafAuthorisation/readNafRedAuthorisation', () => ({
  readNafRedAuthorisation: vi.fn(async () =>
    Promise.resolve({ historial: [] }),
  ),
}))

describe('tgssAutorizadoNaf', () => {
  it('is the tgss autorizado-naf command', async () => {
    const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

    expect(tgssAutorizadoNaf.portal).toBe('tgss')
    expect(tgssAutorizadoNaf.action).toBe('autorizado-naf')
    await expect(tgssAutorizadoNaf.run(client, {})).resolves.toEqual({
      historial: [],
    })
  })
})
