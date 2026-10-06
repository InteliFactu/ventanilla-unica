/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { perceptorCsv } from '../../tools/model190/fixtures/perceptorCsv'
import { aeatModelo190 } from './aeatModelo190'

const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }
const declarantOptions = {
  ejercicio: '2025',
  nif: '00000005M',
  nombre: 'Empresa de Prueba, S.L.',
  telefono: '600000000',
  contacto: 'Prueba Prueba, Pepe',
}

describe('aeatModelo190', () => {
  it('runs offline', () => {
    expect(aeatModelo190.needsCertificate).toBe(false)
  })

  it('writes the file in ISO-8859-1 and sums it', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'modelo190-'))
    const datos = join(dir, 'datos.csv')
    const out = join(dir, '190.txt')
    await writeFile(datos, perceptorCsv)
    await expect(
      aeatModelo190.run(client, { ...declarantOptions, datos, out }),
    ).resolves.toEqual({
      fichero: out,
      registros: 3,
      percepciones: '1336.16',
      retenciones: '24.69',
    })
    const bytes = await readFile(out)
    expect(bytes).toHaveLength(2000)
    expect(bytes.toString('latin1').slice(17, 57).trim()).toBe(
      'EMPRESA DE PRUEBA S L',
    )
    expect(request).not.toHaveBeenCalled()
  })

  it('refuses an empty CSV and a missing option', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'modelo190-'))
    const datos = join(dir, 'datos.csv')
    await writeFile(datos, 'nif,nombre\n')
    await expect(
      aeatModelo190.run(client, {
        ...declarantOptions,
        datos,
        out: join(dir, 'x'),
      }),
    ).rejects.toThrow(/no perceptor rows/)
    await expect(aeatModelo190.run(client, { datos })).rejects.toThrow(
      /out is missing/,
    )
  })
})
