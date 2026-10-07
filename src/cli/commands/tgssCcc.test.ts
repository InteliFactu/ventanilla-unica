import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { tgssCcc } from './tgssCcc'

vi.mock('../../tgss/employer/readEmployerAccounts', () => ({
  readEmployerAccounts: vi.fn(async () => Promise.resolve({ accounts: [] })),
}))

describe('tgssCcc', () => {
  it('is the tgss ccc command', async () => {
    const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

    expect(tgssCcc.portal).toBe('tgss')
    expect(tgssCcc.action).toBe('ccc')
    await expect(tgssCcc.run(client, {})).resolves.toEqual({ accounts: [] })
  })
})
