import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { acceptOneNotification } from './acceptOneNotification'
import { attemptAppearance } from './attemptAppearance'

vi.mock('./acceptOneNotification', () => ({
  acceptOneNotification: vi.fn(),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const session = { client, authData: 'JWT', legalTextId: '901' }
const notification = {
  id: 'N1',
  reference: 'REF1',
  subject: 'S',
  issuer: 'I',
  createdAt: '2026-01-01',
  expiresAt: '2026-01-11',
  state: 'pending' as const,
}

describe('attemptAppearance', () => {
  it('passes an acceptance through', async () => {
    vi.mocked(acceptOneNotification).mockResolvedValueOnce({
      id: 'N1',
      accepted: true,
      status: 200,
    })
    await expect(
      attemptAppearance(
        vi.fn().mockResolvedValue(session),
        notification,
        undefined,
        vi.fn(),
      ),
    ).resolves.toEqual({ id: 'N1', accepted: true, status: 200 })
  })

  it('reports a failure as an outcome instead of throwing', async () => {
    vi.mocked(acceptOneNotification).mockRejectedValueOnce(
      new Error('DEHU: no Cl@ve form in the appearance-login-form answer'),
    )
    await expect(
      attemptAppearance(
        vi.fn().mockResolvedValue(session),
        notification,
        undefined,
        vi.fn(),
      ),
    ).resolves.toEqual({
      id: 'N1',
      reference: 'REF1',
      subject: 'S',
      issuer: 'I',
      expiresAt: '2026-01-11',
      accepted: false,
      error: 'DEHU: no Cl@ve form in the appearance-login-form answer',
    })
  })

  it('reports a failed login as an outcome instead of throwing', async () => {
    vi.mocked(acceptOneNotification).mockClear()
    await expect(
      attemptAppearance(
        vi.fn().mockRejectedValue(new Error('DEHU: certificate login failed')),
        notification,
        undefined,
        vi.fn(),
      ),
    ).resolves.toMatchObject({
      id: 'N1',
      accepted: false,
      error: 'DEHU: certificate login failed',
    })
    expect(acceptOneNotification).not.toHaveBeenCalled()
  })
})
