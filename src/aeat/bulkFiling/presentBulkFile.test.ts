/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { bulkFileText } from './fixtures/bulkFileText'
import { fakeTgviClient } from './fixtures/fakeTgviClient'
import { presentBulkFile } from './presentBulkFile'

const header = bulkFileText.slice(0, 500)
const switched = { representedAfterSwitch: '00000005M' }

const fileOnDisk = async (): Promise<{ fichero: string; dir: string }> => {
  const dir = await mkdtemp(join(tmpdir(), 'tgvi-'))
  const fichero = join(dir, '190.txt')
  await writeFile(fichero, bulkFileText, 'latin1')
  return { fichero, dir }
}

describe('presentBulkFile', () => {
  it('unconfirmed acts for the declarant, validates and presents nothing', async () => {
    const { fichero } = await fileOnDisk()
    const client = fakeTgviClient(switched)
    const result = await presentBulkFile(
      client,
      { fichero, periodo: '0A' },
      { confirmed: false },
    )
    expect(result.executed).toBe(false)
    expect(result.plan[1]).toBe('Envío ID1: 1 records valid, 0 failing')
    const urls = client.calls.map((call) => call.url.split('/').at(-1))
    expect(urls).toEqual([
      'TGVIOnline?modelo=190&ejercicio=2025',
      'DialogoRepresentacion',
      'InicializarEnvio',
      'EnviarDatos',
    ])
    expect(client.calls[2]?.options.headers).toMatchObject({ ndc: '00000005M' })
  })

  it('lists the failing records and refuses to present any of them', async () => {
    const { fichero } = await fileOnDisk()
    const failing = `${bulkFileText.slice(500, 1000)};(2) 21803 -   Año de Nacimiento SIN CONTENIDO\n`
    const client = fakeTgviClient({
      ...switched,
      totals: { codigo: '0', totalt2ok: '2', totalt2ko: '1', avisos: 'S' },
      errors: failing,
    })
    const query = { fichero, periodo: '0A' }
    const plan = await presentBulkFile(client, query, { confirmed: false })
    expect(plan.plan).toContain(
      '00000001R (2) 21803 - Año de Nacimiento SIN CONTENIDO',
    )
    expect(plan.plan[1]).toMatch(/with warnings/)
    await expect(
      presentBulkFile(client, query, { confirmed: true }),
    ).rejects.toThrow(/1 records fail validation; nothing is filed/)
    expect(
      client.calls.some((call) => call.url.includes('PresentarEnvio')),
    ).toBe(false)
  })

  it('confirmed presents with the firma básica and saves the justificante', async () => {
    const { fichero, dir } = await fileOnDisk()
    const client = fakeTgviClient({ ...switched, shownHeader: header })
    const result = await presentBulkFile(
      client,
      { fichero, periodo: '0A' },
      { confirmed: true, outDir: dir },
    )
    expect(result.receipt).toEqual({
      csv: 'CSVPRUEBA',
      justificantePath: join(dir, 'aeat-190-CSVPRUEBA.pdf'),
    })
    const present = client.calls.find((call) =>
      call.url.includes('PresentarEnvio'),
    )
    expect(present?.options.headers).toMatchObject({
      idenvio: 'ID1',
      firnif: '00000000T',
      fir: 'FirmaBasica',
    })
  })

  it('refuses when the window would register another record', async () => {
    const { fichero } = await fileOnDisk()
    const shownHeader = `${header.slice(0, 135)}000000001${header.slice(144)}`
    const client = fakeTgviClient({ ...switched, shownHeader })
    await expect(
      presentBulkFile(client, { fichero, periodo: '0A' }, { confirmed: true }),
    ).rejects.toThrow(/would register/)
    expect(
      client.calls.some((call) => call.url.includes('PresentarEnvio')),
    ).toBe(false)
  })

  it.each([
    [{}, /acts for 00000000T, not for the declarant 00000005M/],
    [
      { ...switched, start: { codigo: '1009', mensaje: 'NIF' } },
      /declarant record was refused \(1009: NIF\)/,
    ],
    [
      { ...switched, totals: { codigo: '2010', mensaje: 'x' } },
      /block 1 refused/,
    ],
    [
      {
        ...switched,
        shownHeader: header,
        presented: { codigo: '7', mensaje: 'no' },
      },
      /presentation refused \(7: no\)/,
    ],
  ])('fails safe: %o', async (fake, message) => {
    const { fichero } = await fileOnDisk()
    await expect(
      presentBulkFile(
        fakeTgviClient(fake),
        { fichero, periodo: '0A' },
        { confirmed: true },
      ),
    ).rejects.toThrow(message)
  })
})
