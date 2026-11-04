/* eslint-disable security/detect-non-literal-fs-filename -- paths belong to this test's temporary directory */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { fakeRegistryClient } from '../registry/fixtures/fakeRegistryClient'
import { postsOf } from '../registry/fixtures/postsOf'
import { respondWith } from '../registry/fixtures/respondWith'
import { fileRelecTramite } from './fileRelecTramite'
import { relecTramiteFormHtml } from './fixtures/relecTramiteFormHtml'
import { relecTramiteRoutes } from './fixtures/relecTramiteRoutes'

const dir = mkdtempSync(join(tmpdir(), 'relec-tramite-errors-'))
const pdf = join(dir, 'a.pdf')
writeFileSync(pdf, buildClassicPdf())
const context = { identity: buildTestIdentity(), confirmed: true }
const query = {
  dboid: '6269000000000000000001',
  subject: 'Test catalogue filing',
  documents: [pdf],
  rows: ['61'],
}

describe('fileRelecTramite failures', () => {
  it('rejects ambiguous slot names', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.includes('/Relec/TramitaForm'),
        (url) =>
          respondWith(
            url,
            relecTramiteFormHtml.replaceAll('Identity document', 'Application'),
          ),
      ],
      ...relecTramiteRoutes,
    ])
    await expect(
      fileRelecTramite(client, { ...query, rows: ['Application'] }, context),
    ).rejects.toThrow('ambiguous')
    expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual([
      '/sta/frame.jsp',
    ])
  })

  it('plans without a saved email but refuses confirmation before uploading', async () => {
    const routes: typeof relecTramiteRoutes = [
      [
        (url) => url.includes('/Relec/TramitaForm'),
        (url) =>
          respondWith(
            url,
            relecTramiteFormHtml.replace(
              '$("contact21").value="ana@example.es";',
              '',
            ),
          ),
      ],
      ...relecTramiteRoutes,
    ]
    const client = fakeRegistryClient(routes)
    const plan = await fileRelecTramite(client, query, {
      ...context,
      confirmed: false,
    })
    expect(plan).toMatchObject({
      executed: false,
      filing: { email: undefined },
    })
    await expect(fileRelecTramite(client, query, context)).rejects.toThrow(
      'nothing was uploaded',
    )
    expect(
      postsOf(client).every((call) => call.url.endsWith('/sta/frame.jsp')),
    ).toBe(true)
  })

  it.each([
    ['6269000000000000000001', '6269000000000000000002', 'different procedure'],
    [
      'name="DBOIDPERS"',
      'name="missingPerson"',
      'no certificate holder person id',
    ],
    ["'61','pdf','S'", "'61','xml','S'", 'does not accept PDFs'],
  ])(
    'refuses changed form metadata %s before uploading',
    async (before, after, error) => {
      const client = fakeRegistryClient([
        [
          (url) => url.includes('/Relec/TramitaForm'),
          (url) =>
            respondWith(url, relecTramiteFormHtml.replaceAll(before, after)),
        ],
        ...relecTramiteRoutes,
      ])
      await expect(fileRelecTramite(client, query, context)).rejects.toThrow(
        error,
      )
      expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual(
        ['/sta/frame.jsp'],
      )
    },
  )

  it('stops before registration when a PDF signature upload fails', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.includes('/AutofirmaUpload10?'),
        (url) => respondWith(url, '', 500),
      ],
      ...relecTramiteRoutes,
    ])
    await expect(fileRelecTramite(client, query, context)).rejects.toThrow(
      'AutofirmaUpload10 answered 500',
    )
    expect(
      postsOf(client).some((call) => call.url.includes('/Relec/TramitaJustif')),
    ).toBe(false)
  })

  it('does not retry an uncertain final registration response', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.endsWith('/Relec/TramitaJustif'),
        (url) => respondWith(url, '', 502),
      ],
      ...relecTramiteRoutes,
    ])
    await expect(fileRelecTramite(client, query, context)).rejects.toThrow(
      'check `caceres registros` before filing again',
    )
    expect(
      postsOf(client).filter((call) =>
        call.url.endsWith('/Relec/TramitaJustif'),
      ),
    ).toHaveLength(1)
  })

  it('preserves the executed receipt when justificante download fails', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.includes('/Utils/DocumentCheck'),
        (url) => respondWith(url, 'Unavailable', 500),
      ],
      ...relecTramiteRoutes,
    ])
    const result = await fileRelecTramite(client, query, {
      ...context,
      outDir: dir,
    })
    expect(result).toMatchObject({
      executed: true,
      receipt: { csv: '11112222333344445555' },
    })
    expect(result.notes).toEqual([
      expect.stringContaining('output was not saved'),
    ])
  })
})
