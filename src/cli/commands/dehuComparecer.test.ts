import { describe, expect, it, vi } from 'vitest'

import { appearAtNotifications } from '../../dehu/appearance/appearAtNotifications'
import type { HttpClient } from '../../http/types/HttpClient'
import { dehuComparecer } from './dehuComparecer'

vi.mock('../../dehu/appearance/appearAtNotifications', () => ({
  appearAtNotifications: vi.fn(),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('dehuComparecer', () => {
  it('is a write command whose description warns about deadlines', async () => {
    expect(dehuComparecer.effect).toBe('write')
    expect(dehuComparecer.description).toMatch(/STARTS every legal deadline/)
    await expect(dehuComparecer.run(client, {})).rejects.toThrow('--id')
    await expect(dehuComparecer.run(client, { id: ' , ' })).rejects.toThrow(
      '--id',
    )
  })

  it('plans unless --confirmar si, and splits the identifiers', async () => {
    await dehuComparecer.run(client, { id: 'A, B', confirmar: 'yes' })
    expect(appearAtNotifications).toHaveBeenLastCalledWith(client, {
      ids: ['A', 'B'],
      confirm: false,
      outDir: undefined,
    })
    await dehuComparecer.run(client, { id: 'A', confirmar: 'si', out: '/o' })
    expect(appearAtNotifications).toHaveBeenLastCalledWith(client, {
      ids: ['A'],
      confirm: true,
      outDir: '/o',
    })
  })
})
