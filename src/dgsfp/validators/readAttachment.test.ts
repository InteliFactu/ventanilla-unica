/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readAttachment } from './readAttachment'

const dir = mkdtempSync(join(tmpdir(), 'dgsfp-attach-'))

describe('readAttachment', () => {
  it('reads and hashes a PDF with an accepted name', async () => {
    const path = join(dir, 'Póliza (2026)-ñ_1.pdf')
    writeFileSync(path, '%PDF-1.4 x')
    const attachment = await readAttachment('sMotivo', path)
    expect(attachment.name).toBe('Póliza (2026)-ñ_1.pdf')
    expect(attachment.hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('refuses a name the sede refuses', async () => {
    await expect(
      readAttachment('sMotivo', join(dir, 'a.b.pdf')),
    ).rejects.toThrow('refuses the file name')
  })

  it('refuses a file that is not a PDF', async () => {
    const path = join(dir, 'texto.pdf')
    writeFileSync(path, 'hola')
    await expect(readAttachment('sMotivo', path)).rejects.toThrow('not a PDF')
  })
})
