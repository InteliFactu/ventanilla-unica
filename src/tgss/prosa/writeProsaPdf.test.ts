import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { writeProsaPdf } from './writeProsaPdf'

describe('writeProsaPdf', () => {
  let dir: string | undefined

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('names the file after the kind and a sanitised label', async () => {
    dir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-prosa-'))
    const pdf = Buffer.from('%PDF-1.4 informe')

    const path = await writeProsaPdf(dir, 'nss', 'NOMBRE APELLIDO/2', pdf)

    expect(path).toBe(join(dir, 'tgss-nss-NOMBRE_APELLIDO_2.pdf'))
    // the path is the temp file this test just wrote
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(await readFile(path)).toEqual(pdf)
  })

  it('creates a missing --out directory first', async () => {
    dir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-prosa-'))
    const pdf = Buffer.from('%PDF-1.4 informe')

    const path = await writeProsaPdf(
      join(dir, 'a', 'b'),
      'vida-laboral',
      'X',
      pdf,
    )

    // the path is the temp file this test just wrote
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(await readFile(path)).toEqual(pdf)
  })
})
