import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { writeFilingFiles } from './writeFilingFiles'

describe('writeFilingFiles', () => {
  it('writes each present file once and reports the ones it cannot write', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'ventanilla-unica-filing-'))
    const files = { '.html': Buffer.from('a'), '.pdf': undefined }
    const first = await writeFilingFiles(dir, 's', files)
    expect(first).toEqual({ written: [join(dir, 's.html')], failed: [] })
    const again = await writeFilingFiles(dir, 's', files)
    expect(again.written).toEqual([])
    expect(again.failed[0]).toContain('s.html')
  })
})
