/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { fileProcedureWriting } from './fileProcedureWriting'
import { fakeFilingClient } from './fixtures/fakeFilingClient'
import type { ProcedureFilingQuery } from './types/ProcedureFilingQuery'

const queryFor = async (name: string): Promise<ProcedureFilingQuery> => {
  const dir = await mkdtemp(join(tmpdir(), 'escrito-'))
  await writeFile(join(dir, name), '%PDF-1.4 x')
  return {
    tramite: 'GZ285',
    nif: '11111111H',
    subject: 'Solicitud de devolución',
    phone: '600000000',
    files: [{ path: join(dir, name), type: '231' }],
  }
}

const signed = (client: ReturnType<typeof fakeFilingClient>): boolean =>
  client.calls.some((call) =>
    String(call.options.body).includes('FIR=FirmaBasica'),
  )

describe('fileProcedureWriting', () => {
  it('without confirmation only opens the trámite form: one GET, no upload', async () => {
    const query = await queryFor('a.pdf')
    const client = fakeFilingClient(['a.pdf'], undefined, '11111111H')
    const result = await fileProcedureWriting(client, query, {
      confirmed: false,
    })
    expect(result.executed).toBe(false)
    expect(client.calls).toHaveLength(1)
    expect(client.calls[0]?.options.method).toBeUndefined()
    expect(client.calls[0]?.url).toMatch(/\/FG\?fTramite=GZ285$/)
    expect(result.plan).toContain(
      'Interesado: 11111111H (named at the signature step)',
    )
  })

  it('confirmed, files for the third party and signs once', async () => {
    const query = await queryFor('a.pdf')
    const client = fakeFilingClient(['a.pdf'], undefined, '11111111H')
    const result = await fileProcedureWriting(client, query, {
      confirmed: true,
    })
    const attach = String(client.calls[2]?.options.body)
    expect(attach).toContain('fTerceros=SI')
    expect(attach).toContain('fNif=11111111H')
    expect(attach).toContain('fTipoFichero=231')
    expect(String(client.calls[3]?.options.body)).toContain(
      'fNifAvanzar=11111111H',
    )
    expect(signed(client)).toBe(true)
    expect(result.receipt?.csv).toBe('ZZZZYYYYXXXXWWWW')
  })

  it('refuses to sign when the signature step names another interesado', async () => {
    const query = await queryFor('a.pdf')
    const client = fakeFilingClient(['a.pdf'], undefined, '22222222J')
    await expect(
      fileProcedureWriting(client, query, { confirmed: true }),
    ).rejects.toThrow('names 22222222J instead of 11111111H; nothing is filed')
    expect(signed(client)).toBe(false)
  })
})
