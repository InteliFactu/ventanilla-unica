import { mkdtemp, readFile, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { writeYouthGuaranteePdf } from './writeYouthGuaranteePdf'

describe('private PDF output', () => {
  it('writes the offered PDF with private permissions', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'ventanilla-gj-test-'))
    const pdf = Buffer.from('%PDF-1.7\nsynthetic document')
    const path = await writeYouthGuaranteePdf(dir, 1, pdf)
    // Paths are produced inside a test-owned temporary directory.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(await readFile(path)).toEqual(pdf)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect((await stat(path)).mode & 0o777).toBe(0o600)
  })
  it('does not overwrite a previously downloaded certificate', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'ventanilla-gj-test-'))
    const pdf = Buffer.from('%PDF-1.7\nsynthetic document')
    await writeYouthGuaranteePdf(dir, 1, pdf)
    await expect(writeYouthGuaranteePdf(dir, 1, pdf)).rejects.toThrow(/EEXIST/)
  })
  it('refuses an HTTP-200 login page instead of saving it as a PDF', async () => {
    await expect(
      writeYouthGuaranteePdf('/unused', 1, Buffer.from('<html>Login</html>')),
    ).rejects.toThrow(/not a PDF/)
  })
})
