/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { fileStaContribution } from './fileStaContribution'
import { contributionRoutes } from './fixtures/contributionRoutes'
import { fakeRegistryClient } from './fixtures/fakeRegistryClient'
import { postsOf } from './fixtures/postsOf'

const dir = mkdtempSync(join(tmpdir(), 'contribution-'))
const pdf = join(dir, 'a.pdf')
writeFileSync(pdf, '%PDF-1.4 test')
const query = {
  expediente: '2026/25777D',
  documents: [pdf],
  descriptions: ['Declaración responsable'],
}
const identity = buildTestIdentity()

describe('fileStaContribution', () => {
  it('plans for the represented entity without saving anything', async () => {
    const client = fakeRegistryClient(contributionRoutes)
    const result = await fileStaContribution(client, 'junta', query, {
      identity,
      confirmed: false,
    })
    expect(result.executed).toBe(false)
    expect(result.plan).toEqual([
      'Contribute documents at tramites.juntaex.es to expediente 2026/25777D (Ayuda IA)',
      'As ANA LOPEZ RUIZ, representing EJEMPLO SL (B12345678)',
      'Attach 1: a.pdf (13 bytes), described as "Declaración responsable"',
      'Electronic notifications, notice to ana@example.es',
    ])
    expect(postsOf(client).map((call) => call.url)).toEqual([
      'https://tramites.juntaex.es/sta/api/v1/people/info/expedientes',
    ])
  })

  it('files to the expediente with the entity as subject and the holder as agent', async () => {
    const client = fakeRegistryClient(contributionRoutes)
    const result = await fileStaContribution(
      client,
      'junta',
      { ...query, comment: 'Requerimiento' },
      { identity, confirmed: true },
    )
    expect(result.receipt).toMatchObject({
      registryNumber: '20260000001',
      csv: 'CSV1',
    })
    const saves = postsOf(client)
      .filter((call) => call.url.endsWith('/requests/6269000000810119707984'))
      .map((call) => JSON.parse(call.body) as Record<string, unknown>)
    expect(saves.map((body) => body['mode'])).toEqual([
      'draft',
      'draft',
      'sign',
      '',
    ])
    const submitted = saves[3] ?? {}
    expect(submitted['apordoc']).toEqual({
      expId: 'X1',
      aditionalInfo: 'Requerimiento',
    })
    expect(submitted['infoDocs']).toEqual([])
    expect(submitted['data']).toBeUndefined()
    expect(submitted['documents']).toMatchObject([
      { gid: 'expedientes', description: 'Declaración responsable' },
    ])
    expect(submitted['parties']).toMatchObject({
      subject: { id: 'E1', displayId: 'B12345678', isAgent: false },
      representedBy: { id: 'P1', displayId: '12345678Z', isAgent: true },
    })
  })

  it('refuses an expediente the party has not open', async () => {
    await expect(
      fileStaContribution(
        fakeRegistryClient(contributionRoutes),
        'junta',
        { ...query, expediente: '2026/1X' },
        { identity, confirmed: false },
      ),
    ).rejects.toThrow(
      'no open expediente 2026/1X for this party (open: 2026/25777D)',
    )
  })
})
