/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { createHash } from 'node:crypto'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../../signing/fixtures/buildTestIdentity'
import { assertPdfSignable } from './assertPdfSignable'
import { assertRelecFiles } from './assertRelecFiles'

const dir = mkdtempSync(join(tmpdir(), 'relec-files-'))

describe('assertRelecFiles and assertPdfSignable', () => {
  it('hashes a PDF and refuses anything else', async () => {
    const pdf = join(dir, 'a.pdf')
    writeFileSync(pdf, '%PDF-1.4 x')
    const [file] = await assertRelecFiles([pdf])
    expect(file).toMatchObject({ name: 'a.pdf', bytes: 10 })
    expect(file?.sha256).toBe(
      createHash('sha256').update('%PDF-1.4 x').digest('hex'),
    )
    const text = join(dir, 'a.txt')
    writeFileSync(text, 'hello')
    await expect(assertRelecFiles([text])).rejects.toThrow('not a PDF: a.txt')
  })

  it('refuses a PDF the PAdES writer cannot parse', async () => {
    const broken = join(dir, 'broken.pdf')
    writeFileSync(broken, '%PDF-1.4 no xref')
    await expect(
      assertPdfSignable(buildTestIdentity(), broken),
    ).rejects.toThrow(/^broken\.pdf cannot be PAdES-signed here: /)
  })
})
