/* eslint-disable security/detect-non-literal-fs-filename -- paths belong to this test's temporary directory */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { fakeRegistryClient } from '../../sta/registry/fixtures/fakeRegistryClient'
import { postsOf } from '../../sta/registry/fixtures/postsOf'
import { relecTramiteRoutes } from '../../sta/relec/fixtures/relecTramiteRoutes'
import { commandRegistry } from '../commandRegistry'
import { usageText } from '../usageText'
import { caceresTramite } from './caceresTramite'

describe('caceresTramite', () => {
  it('registers with the standard WRITE confirmation warning', () => {
    expect(commandRegistry).toContain(caceresTramite)
    expect(usageText([caceresTramite])).toContain(
      '[WRITE: needs --confirmar si]',
    )
  })

  it('requires the holder certificate', async () => {
    await expect(
      caceresTramite.run(fakeRegistryClient([]), {}),
    ).rejects.toThrow('needs the holder certificate')
  })

  it('checks arguments before any request', async () => {
    const client = fakeRegistryClient([])
    await expect(
      caceresTramite.run(client, { dboid: '1' }, {} as CertificateIdentity),
    ).rejects.toThrow('--dboid')
    // eslint-disable-next-line @typescript-eslint/unbound-method -- the synthetic request is a vi.fn
    expect(client.request).not.toHaveBeenCalled()
  })

  it.each([undefined, 'yes', 'SI'])(
    'keeps confirmation %s in plan mode',
    async (confirmar) => {
      const dir = mkdtempSync(join(tmpdir(), 'relec-cli-'))
      const pdf = join(dir, 'a.pdf')
      writeFileSync(pdf, buildClassicPdf())
      const client = fakeRegistryClient(relecTramiteRoutes)
      const result = await caceresTramite.run(
        client,
        {
          dboid: '6269000000000000000001',
          asunto: 'Test filing',
          documentos: pdf,
          slots: '61',
          confirmar,
        },
        buildTestIdentity(),
      )
      expect(result).toMatchObject({ executed: false })
      expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual(
        ['/sta/frame.jsp'],
      )
    },
  )
})
