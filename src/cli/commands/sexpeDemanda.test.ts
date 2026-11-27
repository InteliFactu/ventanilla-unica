/* eslint-disable security/detect-non-literal-fs-filename -- the test owns its temporary capture */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { sexpeDemandCapture } from '../../sexpe/fixtures/sexpeDemandCapture'
import { offlineHttpClient } from '../offlineHttpClient'
import { sexpeDemanda } from './sexpeDemanda'

describe('sexpe demanda', () => {
  it('reads an ISO-8859-1 capture without a certificate or HTTP requests', async () => {
    expect(sexpeDemanda.needsCertificate).toBe(false)
    const dir = await mkdtemp(join(tmpdir(), 'sexpe-demanda-'))
    const capture = join(dir, 'demanda.html')
    await writeFile(
      capture,
      sexpeDemandCapture.replace('No renovaci&oacute;n', 'No renovación'),
      'latin1',
    )
    await expect(
      sexpeDemanda.run(offlineHttpClient, { captura: capture }),
    ).resolves.toMatchObject({ status: 'BAJA', cause: 'No renovación' })
  })

  it('requires an explicit local capture path', async () => {
    await expect(sexpeDemanda.run(offlineHttpClient, {})).rejects.toThrow(
      '--captura is required',
    )
  })
})
