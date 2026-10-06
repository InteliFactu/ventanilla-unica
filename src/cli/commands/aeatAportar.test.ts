import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { aeatAportar } from './aeatAportar'

vi.mock('../../aeat/documentFiling/fileDocumentsWithCsv', () => ({
  fileDocumentsWithCsv: vi.fn(
    async (_client: unknown, query: unknown, context: unknown) =>
      Promise.resolve({ query, context }),
  ),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const options = {
  csv: 'ABCDEFGH12345678',
  como: 'interesado',
  asunto: 'Alegaciones',
  telefono: '600000000',
  documentos: 'a.pdf',
}

describe('aeatAportar', () => {
  it('is a write command that says the filing counts as presented today', () => {
    expect(aeatAportar.effect).toBe('write')
    expect(aeatAportar.description).toMatch(/counts as presented today/)
  })

  it('plans without --confirmar si and confirms only with it', async () => {
    const planned = (await aeatAportar.run(client, options)) as {
      context: { confirmed: boolean }
    }
    expect(planned.context.confirmed).toBe(false)
    const confirmed = (await aeatAportar.run(client, {
      ...options,
      confirmar: 'si',
      out: '/tmp/o',
    })) as { context: { confirmed: boolean; outDir: string } }
    expect(confirmed.context).toEqual({ confirmed: true, outDir: '/tmp/o' })
  })

  it('validates the options before touching the portal', async () => {
    await expect(
      aeatAportar.run(client, { ...options, csv: 'x' }),
    ).rejects.toThrow('--csv')
  })
})
