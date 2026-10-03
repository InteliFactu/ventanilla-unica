/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { fileStaRegistryEntry } from './fileStaRegistryEntry'
import { fakeRegistryClient } from './fixtures/fakeRegistryClient'

const dir = mkdtempSync(join(tmpdir(), 'registry-'))
const pdf = join(dir, 'a.pdf')
writeFileSync(pdf, '%PDF-1.4 test')
const query = {
  destination: 'A11030071',
  phone: '600000000',
  subject: 'Asunto',
  documents: [pdf],
}
const identity = buildTestIdentity()

describe('fileStaRegistryEntry', () => {
  it('only reads and plans without confirmation', async () => {
    const client = fakeRegistryClient()
    const result = await fileStaRegistryEntry(client, 'junta', query, {
      identity,
      confirmed: false,
    })
    expect(result.executed).toBe(false)
    expect(result.plan).toContain(
      'Electronic notifications, notice to ana@example.es',
    )
    const posts = postsOf(client)
    expect(posts).toEqual([])
  })

  it('saves, uploads, signs, submits and saves the justificante when confirmed', async () => {
    const client = fakeRegistryClient()
    const result = await fileStaRegistryEntry(client, 'junta', query, {
      identity,
      confirmed: true,
      outDir: dir,
    })
    expect(result.receipt).toEqual({
      reference: '11111111-2222-4333-8444-555555555555',
      registryNumber: '20260000001',
      registeredAt: '2026-10-03T17:36:24.955Z',
      csv: 'CSV1',
      justificante: join(dir, 'justificante-20260000001.pdf'),
    })
    expect(
      readFileSync(join(dir, 'justificante-20260000001.pdf')).toString(),
    ).toBe('%PDF-1.4 receipt')
    const modes = postsOf(client)
      .filter((call) => call.url.endsWith('/requests/6269000000814004007984'))
      .map((call) => (JSON.parse(call.body) as { mode: string }).mode)
    expect(modes).toEqual(['draft', 'draft', 'sign', ''])
    const signed = postsOf(client).find((call) =>
      call.url.includes('AutofirmaUpload'),
    )
    expect(Buffer.from(signed?.body ?? '', 'base64').toString()).toContain(
      '<ds:Signature',
    )
  })

  it('refuses a sede whose general registry is not mapped', async () => {
    await expect(
      fileStaRegistryEntry(fakeRegistryClient(), 'caceres', query, {
        identity,
        confirmed: false,
      }),
    ).rejects.toThrow('caceres: general registry not mapped')
  })

  it('refuses an unknown addressee unit', async () => {
    await expect(
      fileStaRegistryEntry(
        fakeRegistryClient(),
        'junta',
        { ...query, destination: 'A99999999' },
        { identity, confirmed: false },
      ),
    ).rejects.toThrow('no addressee unit with DIR3 code A99999999')
  })
})

/** Every POST the fake client received, with its body as text. */
const postsOf = (
  client: ReturnType<typeof fakeRegistryClient>,
): { url: string; body: string }[] =>
  (
    client.request as unknown as {
      mock: { calls: [string, { method?: string; body?: string | Buffer }?][] }
    }
  ).mock.calls
    .filter(([, options]) => options?.method === 'POST')
    .map(([url, options]) => ({ url, body: String(options?.body ?? '') }))
