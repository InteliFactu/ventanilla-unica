/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../signing/fixtures/buildTestIdentity'
import { respondWith } from '../sta/registry/fixtures/respondWith'
import { fileDgsfpComplaint } from './fileDgsfpComplaint'
import { buildComplaintQuery } from './fixtures/buildComplaintQuery'
import { fakeDgsfpClient } from './fixtures/fakeDgsfpClient'

const { dir, query } = buildComplaintQuery()
const identity = buildTestIdentity('PEREZ GIL ANA - 00000000T')

describe('fileDgsfpComplaint without confirmation', () => {
  it('only reads, plans and saves the unsigned request document without confirmation', async () => {
    const client = fakeDgsfpClient()
    const result = await fileDgsfpComplaint(client, query, {
      identity,
      confirmed: false,
      outDir: dir,
    })
    expect(result.executed).toBe(false)
    expect(result.plan[0]).toContain('as ANA PEREZ GIL (00000000T)')
    const urls = client.calls.map((call) => call.url)
    expect(
      urls.some(
        (url) =>
          url.includes('process') ||
          url.includes('registrar') ||
          url.includes('guardarBorrador'),
      ),
    ).toBe(false)
    const preview = readFileSync(join(dir, 'solicitud-borrador.pdf')).toString(
      'latin1',
    )
    expect(preview).toContain('(HUELLA)')
    expect(preview).toContain('(abc123)')
  })

  it('refuses a session that is not the certificate holder', async () => {
    const client = fakeDgsfpClient()
    await expect(
      fileDgsfpComplaint(client, query, {
        identity: buildTestIdentity('OTRA PERSONA - 11111111H'),
        confirmed: false,
      }),
    ).rejects.toThrow('not the certificate')
  })

  it('stops on the sede postcode validator', async () => {
    const client = fakeDgsfpClient([
      (url) => url.endsWith('validarCodigoPostal'),
      (url) =>
        respondWith(
          url,
          JSON.stringify({
            errores: [
              'El código postal no pertenece a la provincia seleccionada',
            ],
          }),
        ),
    ])
    await expect(
      fileDgsfpComplaint(client, query, { identity, confirmed: false }),
    ).rejects.toThrow('no pertenece')
  })
})
