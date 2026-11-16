import { expect, it, vi } from 'vitest'
import type { HttpClient } from '../../../../http/types/HttpClient'
import { fetchRayuelaResponse } from '../../../session/fetchers/fetchRayuelaResponse'
import { fetchRayuelaTemplate } from './fetchRayuelaTemplate'

vi.mock('../../../session/fetchers/fetchRayuelaResponse', () => ({
  fetchRayuelaResponse: vi.fn(async () =>
    Promise.resolve({
      body: Buffer.from('{"estadoCorrecto":true,"config":{}}'),
    }),
  ),
}))

it('declares the UTF-8 form charset, so accents are not read as Latin-1', async () => {
  const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
  await fetchRayuelaTemplate(client, 'ENVMEN', 'PROCESA', { T_ASUNTO: 'día' })
  const options = vi.mocked(fetchRayuelaResponse).mock.calls[0]?.[2]
  expect(options?.headers?.['Content-Type']).toBe(
    'application/x-www-form-urlencoded; charset=UTF-8',
  )
  expect(options?.form?.['paramsComponente']).toBe('{"T_ASUNTO":"día"}')
})
