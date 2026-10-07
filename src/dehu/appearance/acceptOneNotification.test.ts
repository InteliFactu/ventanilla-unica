import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { downloadOneNotification } from '../documents/downloadOneNotification'
import { acceptOneNotification } from './acceptOneNotification'
import { postNotificationAcceptance } from './fetchers/postNotificationAcceptance'
import { reauthenticateForAppearance } from './reauthenticateForAppearance'

vi.mock('./reauthenticateForAppearance', () => ({
  reauthenticateForAppearance: vi.fn().mockResolvedValue('NEW'),
}))
vi.mock('./fetchers/postNotificationAcceptance', () => ({
  postNotificationAcceptance: vi.fn(),
}))
vi.mock('../documents/downloadOneNotification', () => ({
  downloadOneNotification: vi.fn().mockResolvedValue({
    id: 'N1',
    reference: 'REF1',
    files: [{ kind: 'document', status: 'saved' }],
  }),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const session = { client, authData: 'OLD', legalTextId: '901' }
const notification = {
  id: 'N1',
  reference: 'REF1',
  subject: 'S',
  issuer: 'I',
  createdAt: '2026-01-01',
  state: 'pending' as const,
}
const sleep = vi.fn().mockResolvedValue(undefined)

describe('acceptOneNotification', () => {
  it('accepts with the fresh bearer and downloads with it', async () => {
    vi.mocked(postNotificationAcceptance).mockResolvedValueOnce(200)
    const outcome = await acceptOneNotification(
      session,
      notification,
      '/o',
      sleep,
    )
    expect(reauthenticateForAppearance).toHaveBeenCalledWith(session, 'REF1')
    expect(postNotificationAcceptance).toHaveBeenCalledWith(
      client,
      'NEW',
      'REF1',
    )
    expect(downloadOneNotification).toHaveBeenCalledWith(
      { client, authData: 'NEW' },
      { id: 'N1', reference: 'REF1' },
      '/o',
      sleep,
    )
    expect(outcome.accepted).toBe(true)
    expect(outcome.files).toHaveLength(1)
  })

  it('skips the download without --out', async () => {
    vi.mocked(postNotificationAcceptance).mockResolvedValueOnce(200)
    vi.mocked(downloadOneNotification).mockClear()
    const outcome = await acceptOneNotification(
      session,
      notification,
      undefined,
      sleep,
    )
    expect(outcome).toMatchObject({ accepted: true, status: 200 })
    expect(downloadOneNotification).not.toHaveBeenCalled()
  })

  it('reports a refusal with its status', async () => {
    vi.mocked(postNotificationAcceptance).mockResolvedValueOnce(403)
    const outcome = await acceptOneNotification(
      session,
      notification,
      '/o',
      sleep,
    )
    expect(outcome).toMatchObject({ accepted: false, status: 403 })
  })
})
