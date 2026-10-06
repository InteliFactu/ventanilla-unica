import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { writeCarpetaPdf } from './writeCarpetaPdf'

describe('writeCarpetaPdf', () => {
  it('writes under the directory, creating it', async () => {
    const dir = join(await mkdtemp(join(tmpdir(), 'carpeta-')), 'out')
    const path = await writeCarpetaPdf(dir, 'n.pdf', Buffer.from('%PDF-'))
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect((await readFile(path)).toString()).toBe('%PDF-')
  })

  it('refuses a name that leaves the directory', async () => {
    await expect(
      writeCarpetaPdf('/tmp/x', '../y.pdf', Buffer.from('')),
    ).rejects.toThrow('outside')
  })
})
