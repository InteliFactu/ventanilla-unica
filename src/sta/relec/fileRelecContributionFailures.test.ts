/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { fakeRegistryClient } from '../registry/fixtures/fakeRegistryClient'
import { postsOf } from '../registry/fixtures/postsOf'
import { respondWith } from '../registry/fixtures/respondWith'
import { fileRelecContribution } from './fileRelecContribution'
import { relecRoutes } from './fixtures/relecRoutes'

const dir = mkdtempSync(join(tmpdir(), 'relec-failures-'))
const pdf = join(dir, 'a.pdf')
writeFileSync(pdf, buildClassicPdf())
const query = {
  reference: 'ENT2026000001',
  documents: [pdf],
  typeCodes: ['OTROE'],
  descriptions: ['Otro'],
}
const identity = buildTestIdentity()

describe('fileRelecContribution failures', () => {
  it('keeps the receipt when the justificante cannot be saved', async () => {
    const client = fakeRegistryClient([
      [
        (url: string): boolean => url.includes('/Utils/DocumentCheck'),
        (url: string) => respondWith(url, 'error'),
      ],
      ...relecRoutes,
    ])
    const result = await fileRelecContribution(client, query, {
      identity,
      confirmed: true,
      outDir: dir,
    })
    expect(result.receipt?.csv).toBe('11112222333344445555')
    expect(result.notes[0]).toMatch(/^Registered, but the output was not saved/)
  })

  it('refuses an unknown type before uploading anything', async () => {
    const client = fakeRegistryClient(relecRoutes)
    await expect(
      fileRelecContribution(
        client,
        { ...query, typeCodes: ['NOPE'] },
        { identity, confirmed: true },
      ),
    ).rejects.toThrow(
      'unknown document type NOPE; the sede offers DECL, ALTER, OTROE',
    )
    expect(
      postsOf(client).some((call) => call.url.includes('/FileUploader')),
    ).toBe(false)
  })
})
