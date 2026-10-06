import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import { downloadJuntaCarpetaNotification } from './downloadJuntaCarpetaNotification'
import { carpetaAnswer } from './fixtures/carpetaAnswer'
import { carpetaListAnswer } from './fixtures/carpetaListAnswer'
import { carpetaListPage } from './fixtures/carpetaListPage'
import { fakeCarpetaClient } from './fixtures/fakeCarpetaClient'

vi.mock('../session/loginWithClave', () => ({ loginWithClave: vi.fn() }))

const search = carpetaAnswer(carpetaListPage([]))

describe('downloadJuntaCarpetaNotification', () => {
  it('saves the notification under a safe name, and the acuse when it is a PDF', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'carpeta-'))
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT/9', 'Notificado'),
      carpetaListAnswer('NOT/9', 'Notificado', true),
      carpetaAnswer(Buffer.from('%PDF-not')),
      carpetaAnswer(Buffer.from('%PDF-acuse')),
    )
    const result = await downloadJuntaCarpetaNotification(
      client,
      'NOT/9',
      outDir,
    )
    expect(result.notification['status']).toBe('Notificado')
    expect(result.files).toEqual({
      notification: join(outDir, 'NOT_9.pdf'),
      acuse: join(outDir, 'NOT_9-acuse.pdf'),
    })
  })

  it('refuses a pending notification without opening it', async () => {
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT/9', 'Pendiente'),
    )
    await expect(
      downloadJuntaCarpetaNotification(client, 'NOT/9', '/tmp/unused'),
    ).rejects.toThrow('use junta carpeta-comparecer')
    expect(client.request).toHaveBeenCalledTimes(2)
  })

  it('fails when the sede gives no PDF', async () => {
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT/9', 'Notificado'),
      carpetaListAnswer('NOT/9', 'Notificado', true),
      carpetaAnswer('<html/>'),
    )
    await expect(
      downloadJuntaCarpetaNotification(client, 'NOT/9', '/tmp/unused'),
    ).rejects.toThrow('gave no PDF')
  })
})
