import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { acceptOneNotification } from './acceptOneNotification'
import { appearAtNotifications } from './appearAtNotifications'
import { fetchAcceptLegalTextId } from './fetchers/fetchAcceptLegalTextId'

vi.mock('../session/loginWithCertificate', () => ({
  loginWithCertificate: vi.fn().mockResolvedValue('JWT'),
}))
vi.mock('../notifications/fetchers/fetchPendingNotifications', () => ({
  fetchPendingNotifications: vi.fn().mockResolvedValue({
    pages: 1,
    notifications: [
      {
        id: 'N1',
        reference: 'REF1',
        subject: 'S',
        issuer: 'I',
        createdAt: '2026-01-01',
        expiresAt: '2026-01-11',
        state: 'pending',
      },
      { id: 'N2', subject: 'S', issuer: 'I', createdAt: 'x', state: 'pending' },
      {
        id: 'N3',
        reference: 'REF3',
        subject: 'S3',
        issuer: 'I3',
        createdAt: '2026-01-02',
        expiresAt: '2026-01-12',
        state: 'pending',
      },
    ],
  }),
}))
vi.mock('./fetchers/fetchAcceptLegalTextId', () => ({
  fetchAcceptLegalTextId: vi.fn().mockResolvedValue('901'),
}))
vi.mock('./acceptOneNotification', () => ({
  acceptOneNotification: vi
    .fn()
    .mockResolvedValue({ id: 'N1', accepted: true, status: 200 }),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('appearAtNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('never accepts anything without confirm', async () => {
    const result = await appearAtNotifications(client, {
      ids: ['N1', 'MISSING'],
      confirm: false,
    })
    expect(acceptOneNotification).not.toHaveBeenCalled()
    expect(fetchAcceptLegalTextId).not.toHaveBeenCalled()
    expect(result.executed).toBe(false)
    expect(result.outcomes).toEqual([
      {
        id: 'N1',
        reference: 'REF1',
        subject: 'S',
        issuer: 'I',
        expiresAt: '2026-01-11',
        accepted: false,
      },
      { id: 'MISSING', notPending: true, accepted: false },
    ])
  })

  it('accepts each pending requested one when confirmed', async () => {
    const result = await appearAtNotifications(client, {
      ids: ['N1', 'N2'],
      confirm: true,
      outDir: '/o',
    })
    expect(acceptOneNotification).toHaveBeenCalledTimes(1)
    expect(vi.mocked(acceptOneNotification).mock.calls[0]?.[0]).toEqual({
      client,
      authData: 'JWT',
      legalTextId: '901',
    })
    expect(result.executed).toBe(true)
    expect(result.outcomes[1]).toEqual({
      id: 'N2',
      notPending: true,
      accepted: false,
    })
  })

  it('logs in anew before each notification after the first', async () => {
    vi.mocked(loginWithCertificate)
      .mockResolvedValueOnce('JWT')
      .mockResolvedValueOnce('JWT2')
    await appearAtNotifications(client, {
      ids: ['N1', 'N3'],
      confirm: true,
    })
    expect(loginWithCertificate).toHaveBeenCalledTimes(2)
    expect(
      vi.mocked(acceptOneNotification).mock.calls.map((call) => call[0]),
    ).toEqual([
      { client, authData: 'JWT', legalTextId: '901' },
      { client, authData: 'JWT2', legalTextId: '901' },
    ])
  })
})
