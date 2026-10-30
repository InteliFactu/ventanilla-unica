import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { downloadAeatCsvDocument } from './downloadAeatCsvDocument'

const session = htmlResponse('https://www1.agenciatributaria.gob.es/x', 'ok')
const pdf = { ...session, body: Buffer.from('%PDF-1.4 fixture') }

describe('downloadAeatCsvDocument', () => {
  let out: string | undefined

  afterEach(async () => {
    if (out) await rm(out, { recursive: true, force: true })
    out = undefined
  })

  it('opens the session, asks for the CSV and saves the PDF', async () => {
    out = await mkdtemp(join(tmpdir(), 'ventanilla-unica-csv-'))
    const client = scriptedClient(session, pdf)
    const result = await downloadAeatCsvDocument(client, {
      csv: 'ABCDEFGH12345678',
      nif: '00000000T',
      out,
    })
    expect(result).toEqual({
      csv: 'ABCDEFGH12345678',
      path: join(out, 'aeat-csv-ABCDEFGH12345678.pdf'),
      bytes: 16,
    })
    expect(client.request.mock.calls[1]?.[0]).toContain(
      'CSV=ABCDEFGH12345678&NIF=00000000T',
    )
    // The path was built by the code under test inside this test's temp dir.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await expect(readFile(result.path)).resolves.toEqual(pdf.body)
  })

  it('fails when the CSV answers no PDF', async () => {
    const client = scriptedClient(session, session)
    await expect(
      downloadAeatCsvDocument(client, {
        csv: 'X',
        nif: '',
        out: '/nonexistent',
      }),
    ).rejects.toThrow('CSV X returned no document')
  })
})
