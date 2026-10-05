import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../signing/fixtures/buildTestIdentity'
import { respondWith } from '../sta/registry/fixtures/respondWith'
import { fileDgsfpComplaint } from './fileDgsfpComplaint'
import { buildComplaintQuery } from './fixtures/buildComplaintQuery'
import { fakeDgsfpClient } from './fixtures/fakeDgsfpClient'
import type { DgsfpRegisterRequest } from './types/DgsfpRegisterRequest'

const { dir, query } = buildComplaintQuery()
const identity = buildTestIdentity('PEREZ GIL ANA - 00000000T')

describe('fileDgsfpComplaint confirmed', () => {
  it('uploads, checks, saves the draft, signs and registers when confirmed', async () => {
    const client = fakeDgsfpClient()
    const result = await fileDgsfpComplaint(client, query, {
      identity,
      confirmed: true,
      outDir: dir,
    })
    expect(result.receipt).toEqual({
      registryNumber: 'REG/0001',
      registeredAt: '05/10/2026 17:00:00',
      csv: 'CSV1',
      justificante: join(dir, 'Justificante.pdf'),
      solicitud: join(dir, 'solicitud-REG-0001.pdf'),
    })
    const register = client.calls.find((call) =>
      call.url.endsWith('registrarPresentacionTelematica'),
    )
    const body = JSON.parse(register?.body ?? '{}') as DgsfpRegisterRequest
    expect(body.numTelematico).toBe('TEL43')
    expect(body.ficherosAdjuntos.map((entry) => entry.nombreCampo)).toEqual([
      'sMotivo',
      'fSACDEC',
      'sAnexos',
    ])
    const signed = Buffer.from(body.formularioPdfFirmadoB64, 'base64')
    expect(signed.subarray(0, 8).toString()).toBe('%PDF-1.4')
    expect(signed.toString('latin1')).toContain('/ETSI.CAdES.detached')
    const values = JSON.parse(body.datosFormulario) as {
      secciones: {
        lineasSeccion: {
          campos: ({ nombre: string; value: string; key: string } | null)[]
        }[]
      }[]
    }
    const fields = values.secciones
      .flatMap((s) => s.lineasSeccion)
      .flatMap((l) => l.campos)
    const byName = (name: string): { value: string; key: string } | undefined =>
      fields.find((f) => f?.nombre === name) ?? undefined
    expect(byName('cbnotificacion')).toMatchObject({
      key: '1',
      value: 'Notificación Electrónica',
    })
    expect(byName('sNif')?.value).toBe('00000000T')
    expect(byName('dFechaPresentacion')?.value).toBe('2026-09-30T00:00:00.000Z')
    expect(byName('sDepartamento')?.value).toBe('1')
    expect(byName('bFirmante')?.value).toBe('true')
  })

  it('refuses an upload answered without the content hash', async () => {
    const client = fakeDgsfpClient([
      (url) => url.endsWith('/process'),
      (url) => respondWith(url, '"TEL43;#x;#deadbeef"'),
    ])
    await expect(
      fileDgsfpComplaint(client, query, { identity, confirmed: true }),
    ).rejects.toThrow('without its SHA-256')
  })

  it('reports a filing answered without a registry number, and keeps no files without --out', async () => {
    const client = fakeDgsfpClient([
      (url) => url.endsWith('registrarPresentacionTelematica'),
      (url) => respondWith(url, 'null'),
    ])
    await expect(
      fileDgsfpComplaint(client, query, { identity, confirmed: true }),
    ).rejects.toThrow('without a registry number')
  })
})
