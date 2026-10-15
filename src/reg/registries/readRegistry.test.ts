import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { fakeRegClient } from '../fixtures/fakeRegClient'
import { listRegistries } from './listRegistries'
import { readRegistry } from './readRegistry'

describe('REG registries', () => {
  it('lists one page as the bearer holder, without the jwt', async () => {
    const client = fakeRegClient()
    const listing = await listRegistries(client, 2)
    expect(listing.totalPages).toBe(1)
    expect(listing.holder).not.toHaveProperty('jwt')
    const search = client.calls.find((c) => c.url.endsWith('searchRegistry'))
    expect(search?.body).toContain('"pageNumber":2')
  })

  it('reads an entry with its trace and saves documents under base names', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'reg-out-'))
    const report = await readRegistry(fakeRegClient(), 'u1', dir)
    expect(report.trace).toEqual([{ dsState: 'REGISTRO ENVIADO' }])
    const [saved] = report.saved
    expect(saved).toBe(join(dir, 'v1-JustificanteFirmado.pdf'))
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(readFileSync(saved ?? '').toString()).toBe('%PDF-1.4 receipt')
  })
})
