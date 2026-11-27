import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchPendingNotifications } from './fetchers/fetchPendingNotifications'
import { fetchRealizedNotifications } from './fetchers/fetchRealizedNotifications'
import { listNotifications } from './listNotifications'
import type { Notification } from './types/Notification'

vi.mock('../session/loginWithCertificate')
vi.mock('./fetchers/fetchPendingNotifications')
vi.mock('./fetchers/fetchRealizedNotifications')

const pendingNotification: Notification = {
  id: 'P1',
  subject: 'Pending',
  issuer: 'AEAT',
  createdAt: '2026-01-01',
  state: 'pending',
}

const realizedNotification: Notification = {
  id: 'R1',
  subject: 'Realized',
  issuer: 'AEAT',
  createdAt: '2026-02-01',
  state: 'compareced',
}

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

beforeEach(() => {
  vi.mocked(loginWithCertificate).mockResolvedValue('TOKEN')
  vi.mocked(fetchPendingNotifications).mockResolvedValue({
    notifications: [pendingNotification],
    pages: 1,
  })
  vi.mocked(fetchRealizedNotifications).mockResolvedValue({
    notifications: [realizedNotification],
    pages: 3,
  })
})

describe('listNotifications', () => {
  it('checks the requested holder before querying a list', async () => {
    const payload = Buffer.from(
      JSON.stringify({ username: '00000000T' }),
    ).toString('base64url')
    vi.mocked(loginWithCertificate).mockResolvedValue(
      `header.${payload}.signature`,
    )
    await expect(
      listNotifications(client, { state: 'pending', expectedNif: '00000001R' }),
    ).rejects.toThrow('different holder')
    expect(fetchPendingNotifications).not.toHaveBeenCalled()
    expect(fetchRealizedNotifications).not.toHaveBeenCalled()
    await expect(
      listNotifications(client, { state: 'pending', expectedNif: '00000000T' }),
    ).resolves.toMatchObject({ count: 1 })
  })

  it('reads only pending notifications by default', async () => {
    const result = await listNotifications(client, { state: 'pending' })
    expect(result).toEqual({
      state: 'pending',
      notifications: [pendingNotification],
      count: 1,
      pages: 1,
    })
    expect(fetchRealizedNotifications).not.toHaveBeenCalled()
  })

  it('reads only realized notifications for the given year', async () => {
    const result = await listNotifications(client, {
      state: 'realized',
      year: 2026,
    })
    expect(result).toEqual({
      state: 'realized',
      notifications: [realizedNotification],
      count: 1,
      pages: 3,
    })
    expect(fetchPendingNotifications).not.toHaveBeenCalled()
    expect(fetchRealizedNotifications).toHaveBeenCalledWith(
      client,
      'TOKEN',
      2026,
    )
  })

  it('combines both for state=all', async () => {
    const result = await listNotifications(client, { state: 'all', year: 2026 })
    expect(result.count).toBe(2)
    expect(result.pages).toBe(4)
    expect(result.notifications).toEqual([
      pendingNotification,
      realizedNotification,
    ])
  })

  it('requires a year for realized and all', async () => {
    await expect(
      listNotifications(client, { state: 'realized' }),
    ).rejects.toThrow('--year is required')
    await expect(listNotifications(client, { state: 'all' })).rejects.toThrow(
      '--year is required',
    )
  })
})
