/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { assertPdfFiles } from './assertPdfFiles'

const dir = mkdtempSync(join(tmpdir(), 'pdfs-'))

describe('assertPdfFiles', () => {
  it('returns the name and size of each PDF', async () => {
    const path = join(dir, 'ok.pdf')
    writeFileSync(path, '%PDF-1.4')
    await expect(assertPdfFiles([path])).resolves.toEqual([
      { name: 'ok.pdf', bytes: 8 },
    ])
  })

  it('refuses a file that is not a PDF', async () => {
    const path = join(dir, 'note.txt')
    writeFileSync(path, 'hello')
    await expect(assertPdfFiles([path])).rejects.toThrow('not a PDF: note.txt')
  })

  it('refuses a PDF over the per-file limit', async () => {
    const path = join(dir, 'big.pdf')
    writeFileSync(
      path,
      Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(10_300_000)]),
    )
    await expect(assertPdfFiles([path])).rejects.toThrow('exceeds')
  })
})
