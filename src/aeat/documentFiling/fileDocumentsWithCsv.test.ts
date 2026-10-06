/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { fileDocumentsWithCsv } from './fileDocumentsWithCsv'
import { fakeFilingClient } from './fixtures/fakeFilingClient'
import type { DocumentFilingQuery } from './types/DocumentFilingQuery'

const queryFor = async (
  names: readonly string[],
): Promise<{ query: DocumentFilingQuery; dir: string }> => {
  const dir = await mkdtemp(join(tmpdir(), 'aportar-'))
  for (const name of names) await writeFile(join(dir, name), '%PDF-1.4 x')
  return {
    dir,
    query: {
      csv: 'ABCDEFGH12345678',
      role: 'R',
      subject: 'Alegaciones al expediente',
      phone: '600000000',
      files: names.map((name) => ({ path: join(dir, name), type: '203' })),
    },
  }
}

describe('fileDocumentsWithCsv', () => {
  it('without confirmation only opens the form: no upload, no POST', async () => {
    const { query } = await queryFor(['a.pdf'])
    const client = fakeFilingClient(['a.pdf'])
    const result = await fileDocumentsWithCsv(client, query, {
      confirmed: false,
    })
    expect(result.executed).toBe(false)
    expect(result.plan).toContain('Interesado: 00000000T PEREZ PEREZ JUAN')
    expect(result.plan).toContain('Documento 1: a.pdf (tipo 203, 10 bytes)')
    expect(client.calls).toHaveLength(1)
    expect(client.calls[0]?.options.method).toBeUndefined()
    expect(client.calls[0]?.url).toContain('fTipoRepresentacion=R')
  })

  it('confirmed, uploads and attaches each file, then signs once with firma básica', async () => {
    const { query, dir } = await queryFor(['a.pdf', 'b.pdf'])
    const client = fakeFilingClient(['a.pdf', 'b.pdf'])
    const result = await fileDocumentsWithCsv(client, query, {
      confirmed: true,
      outDir: dir,
    })
    expect(client.calls.map((call) => call.url.split('/').at(-1))).toEqual([
      expect.stringContaining('FGCSV?'),
      'UploadSv',
      'FGGraba',
      'UploadSv',
      'FGGraba',
      'FG',
      'FG',
      expect.stringContaining('CotejoDocIdSv?CSV=ZZZZYYYYXXXXWWWW'),
    ])
    const signature = String(client.calls[6]?.options.body)
    expect(signature).toContain('FIRNIF=99999999R')
    expect(signature).toContain('FIR=FirmaBasica')
    expect(signature).not.toContain('FirmayEnvia')
    expect(String(client.calls[2]?.options.body)).toContain('fTipoFichero=203')
    expect(result.executed).toBe(true)
    expect(result.receipt?.csv).toBe('ZZZZYYYYXXXXWWWW')
    expect(
      await readFile(String(result.receipt?.justificantePath), 'latin1'),
    ).toMatch(/^%PDF/)
  })

  it('refuses to sign when the signature step lists other files', async () => {
    const { query } = await queryFor(['a.pdf'])
    const client = fakeFilingClient(['other.pdf'])
    await expect(
      fileDocumentsWithCsv(client, query, { confirmed: true }),
    ).rejects.toThrow('nothing is filed')
    expect(
      client.calls.some((call) =>
        String(call.options.body).includes('FIR=FirmaBasica'),
      ),
    ).toBe(false)
  })

  it('refuses a representative filing the registry opened without one', async () => {
    const { query } = await queryFor(['a.pdf'])
    const client = fakeFilingClient(['a.pdf'])
    client.request.mockResolvedValueOnce({
      status: 200,
      url: 'u',
      headers: {},
      body: Buffer.alloc(0),
      text: "<h2>Datos del Interesado</h2>NIF: 00000000T Nombre / Razón Social: X <li>Trámite: XX706 - Algo</li><form id='Form'></form>",
    })
    await expect(
      fileDocumentsWithCsv(client, query, { confirmed: true }),
    ).rejects.toThrow('without a representative')
  })
})
