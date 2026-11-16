import { expect, it, vi } from 'vitest'
import type { HttpClient } from '../../http/types/HttpClient'
import { replyToRayuelaMessage } from '../../rayuela/messages/reply/replyToRayuelaMessage'
import { rayuelaResponder } from './rayuelaResponder'

vi.mock('../../rayuela/messages/reply/replyToRayuelaMessage', () => ({
  replyToRayuelaMessage: vi.fn(async () =>
    Promise.resolve({ executed: false }),
  ),
}))
const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

it('is a write that only sends with --confirmar si', async () => {
  expect(rayuelaResponder.effect).toBe('write')
  await rayuelaResponder.run(client, { id: '7', texto: 'Hola' })
  expect(vi.mocked(replyToRayuelaMessage).mock.lastCall?.[1]).toMatchObject({
    confirm: false,
  })
  await rayuelaResponder.run(client, {
    id: '7',
    texto: 'Hola',
    confirmar: 'no',
  })
  expect(vi.mocked(replyToRayuelaMessage).mock.lastCall?.[1]).toMatchObject({
    confirm: false,
  })
  await rayuelaResponder.run(client, {
    id: '7',
    texto: 'Hola',
    confirmar: 'si',
  })
  expect(vi.mocked(replyToRayuelaMessage).mock.lastCall?.[1]).toMatchObject({
    confirm: true,
  })
})
it('requires a numeric --id and a --texto', async () => {
  await expect(rayuelaResponder.run(client, { texto: 'x' })).rejects.toThrow(
    '--id',
  )
  await expect(rayuelaResponder.run(client, { id: '7' })).rejects.toThrow(
    '--texto',
  )
})
