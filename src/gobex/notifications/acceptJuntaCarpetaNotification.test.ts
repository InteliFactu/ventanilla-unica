import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import { acceptJuntaCarpetaNotification } from './acceptJuntaCarpetaNotification'
import { carpetaAcceptPage } from './fixtures/carpetaAcceptPage'
import { carpetaAnswer } from './fixtures/carpetaAnswer'
import { carpetaListAnswer } from './fixtures/carpetaListAnswer'
import { carpetaListPage } from './fixtures/carpetaListPage'
import { fakeCarpetaClient } from './fixtures/fakeCarpetaClient'

vi.mock('../session/loginWithClave', () => ({ loginWithClave: vi.fn() }))

const search = carpetaAnswer(carpetaListPage([]))
const accepting = (): boolean => true

const acceptPosts = (client: ReturnType<typeof fakeCarpetaClient>): number =>
  client.request.mock.calls.filter(
    ([, options]) => options?.form?.['AJAXREQUEST'] !== undefined,
  ).length

describe('acceptJuntaCarpetaNotification', () => {
  it('only reads and plans without confirmation', async () => {
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT-7', 'Pendiente'),
    )
    const result = await acceptJuntaCarpetaNotification(client, {
      id: 'NOT-7',
      confirm: false,
    })
    expect(result).toMatchObject({
      executed: false,
      accepted: false,
      notes: [],
      notification: { notification: 'NOT-7', status: 'Pendiente' },
    })
    expect(result.plan.join(' ')).toMatch(/STARTS every legal deadline/)
    expect(client.request).toHaveBeenCalledTimes(2)
  })

  it('accepts, searches again and downloads when confirmed', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'carpeta-'))
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT-7', 'Pendiente'),
      carpetaAnswer(carpetaAcceptPage, 'firmarAcuseRecibo.jsf'),
      carpetaAnswer('El documento se ha firmado correctamente.'),
      search,
      carpetaListAnswer('NOT-7', 'Notificado'),
      carpetaListAnswer('NOT-7', 'Notificado', true),
      carpetaAnswer(Buffer.from('%PDF-not')),
      carpetaAnswer(Buffer.from('%PDF-acuse')),
    )
    const result = await acceptJuntaCarpetaNotification(client, {
      id: 'NOT-7',
      confirm: accepting(),
      outDir,
    })
    expect(result).toMatchObject({ executed: true, accepted: true })
    expect(result.receipt).toEqual({
      notification: join(outDir, 'NOT-7.pdf'),
      acuse: join(outDir, 'NOT-7-acuse.pdf'),
    })
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect((await readFile(join(outDir, 'NOT-7.pdf'))).toString()).toBe(
      '%PDF-not',
    )
    expect(acceptPosts(client)).toBe(1)
  })

  it('accepts without downloading when no --out is given', async () => {
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT-7', 'Pendiente'),
      carpetaAnswer(carpetaAcceptPage, 'firmarAcuseRecibo.jsf'),
      carpetaAnswer('El documento se ha firmado correctamente.'),
    )
    const result = await acceptJuntaCarpetaNotification(client, {
      id: 'NOT-7',
      confirm: accepting(),
    })
    expect(result).toMatchObject({ executed: true, accepted: true })
    expect(result.receipt).toBeUndefined()
  })

  it('never accepts an already accepted notification again', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'carpeta-'))
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT-7', 'Notificado'),
      carpetaListAnswer('NOT-7', 'Notificado', true),
      carpetaAnswer(Buffer.from('%PDF-not')),
      carpetaAnswer('<html>no acuse</html>'),
    )
    const result = await acceptJuntaCarpetaNotification(client, {
      id: 'NOT-7',
      confirm: accepting(),
      outDir,
    })
    expect(result).toMatchObject({
      executed: false,
      accepted: 'already',
      receipt: { notification: join(outDir, 'NOT-7.pdf'), acuse: null },
    })
    expect(acceptPosts(client)).toBe(0)
  })

  it('reports an already accepted one in plan mode, and acts on no other state', async () => {
    const planned = await acceptJuntaCarpetaNotification(
      fakeCarpetaClient(search, carpetaListAnswer('NOT-7', 'Notificado')),
      { id: 'NOT-7', confirm: false },
    )
    expect(planned.accepted).toBe('already')
    const client = fakeCarpetaClient(
      search,
      carpetaListAnswer('NOT-7', 'Expirado'),
    )
    const expired = await acceptJuntaCarpetaNotification(client, {
      id: 'NOT-7',
      confirm: accepting(),
    })
    expect(expired).toMatchObject({ executed: false, accepted: false })
    expect(expired.notes[0]).toMatch(/is Expirado: it cannot be accepted/)
    expect(client.request).toHaveBeenCalledTimes(2)
  })
})
