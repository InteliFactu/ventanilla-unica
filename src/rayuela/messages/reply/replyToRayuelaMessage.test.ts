import { beforeEach, expect, it, vi } from 'vitest'
import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchRayuelaPage } from '../../session/fetchers/fetchRayuelaPage'
import { listRayuelaMessages } from '../listRayuelaMessages'
import { fetchRayuelaReplyForm } from './fetchers/fetchRayuelaReplyForm'
import { sendRayuelaReply } from './fetchers/sendRayuelaReply'
import { replyToRayuelaMessage } from './replyToRayuelaMessage'

vi.mock('../../session/fetchers/fetchRayuelaPage', () => ({
  fetchRayuelaPage: vi.fn(async () => Promise.resolve('<inbox>')),
}))
vi.mock('../listRayuelaMessages', () => ({
  listRayuelaMessages: vi.fn(async () =>
    Promise.resolve({ messages: [], total: 0, notes: [] }),
  ),
}))
vi.mock('./fetchers/fetchRayuelaReplyForm', () => ({
  fetchRayuelaReplyForm: vi.fn(async () =>
    Promise.resolve({
      subject: 'RE: Tutoría',
      recipientId: '22031',
      recipientName: 'Alcalá Suárez, Jorge',
      config: {},
    }),
  ),
}))
vi.mock('./fetchers/sendRayuelaReply', () => ({
  sendRayuelaReply: vi.fn(async () => Promise.resolve({ status: 'ok' })),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
beforeEach(() => {
  vi.mocked(sendRayuelaReply).mockClear()
})

it('plans without sending when not confirmed', async () => {
  const result = await replyToRayuelaMessage(client, {
    messageId: '7',
    body: 'Hola',
    confirm: false,
  })
  expect(result.executed).toBe(false)
  expect(result.plan).toContain('To: Alcalá Suárez, Jorge')
  expect(sendRayuelaReply).not.toHaveBeenCalled()
  expect(fetchRayuelaPage).toHaveBeenCalled()
  expect(fetchRayuelaReplyForm).toHaveBeenCalled()
  expect(listRayuelaMessages).toHaveBeenCalledWith(client, 'ENV')
})

it('sends exactly once when confirmed, as HTML', async () => {
  const result = await replyToRayuelaMessage(client, {
    messageId: '7',
    body: 'Hola',
    confirm: true,
  })
  expect(result.executed).toBe(true)
  expect(sendRayuelaReply).toHaveBeenCalledTimes(1)
  expect(vi.mocked(sendRayuelaReply).mock.calls[0]?.[2]).toBe('<p>Hola</p>')
})

it('refuses an empty text', async () => {
  await expect(
    replyToRayuelaMessage(client, {
      messageId: '7',
      body: '  ',
      confirm: true,
    }),
  ).rejects.toThrow('empty')
  expect(sendRayuelaReply).not.toHaveBeenCalled()
})
