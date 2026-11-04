import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import { fetchYouthGuaranteeDocuments } from './fetchYouthGuaranteeDocuments'

describe('offered document downloads', () => {
  it('saves the exact PDF bytes from an offered certificate', async () => {
    const out = await mkdtemp(join(tmpdir(), 'ventanilla-gj-download-'))
    const url = 'https://garantiajuvenil.sepe.es/certificado.pdf'
    const client = scriptedClient(
      htmlResponse(url, '%PDF-1.7\nsynthetic certificate'),
    )
    const result = await fetchYouthGuaranteeDocuments(
      client,
      [{ label: 'Certificado', url }],
      out,
    )
    expect(result[0]?.path).toBe(join(out, 'sepe-garantia-juvenil-1.pdf'))
    // The path is inside the test's own temporary directory.
    expect(
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await readFile(join(out, 'sepe-garantia-juvenil-1.pdf'), 'utf8'),
    ).toBe('%PDF-1.7\nsynthetic certificate')
  })
  it('refuses redirects without fetching their target', async () => {
    const url = 'https://garantiajuvenil.sepe.es/certificado.pdf'
    const client = scriptedClient({
      ...htmlResponse(url, ''),
      status: 302,
      headers: { location: 'https://example.com/file.pdf' },
    })
    await expect(
      fetchYouthGuaranteeDocuments(
        client,
        [{ label: 'Certificado', url }],
        '/unused',
      ),
    ).rejects.toThrow(/redirects are refused/)
    expect(client.request.mock.calls).toHaveLength(1)
  })
  it('refuses foreign document URLs before any network call', async () => {
    const client = scriptedClient()
    await expect(
      fetchYouthGuaranteeDocuments(
        client,
        [{ label: 'Certificado', url: 'https://example.com/file.pdf' }],
        '/unused',
      ),
    ).rejects.toThrow(/foreign document/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
