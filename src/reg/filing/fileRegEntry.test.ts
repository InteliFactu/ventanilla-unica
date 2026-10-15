import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { respondJson } from '../../dgsfp/fixtures/respondJson'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildRegFilingQuery } from '../fixtures/buildRegFilingQuery'
import { fakeRegClient } from '../fixtures/fakeRegClient'
import { fileRegEntry } from './fileRegEntry'

const { dir, query } = buildRegFilingQuery()
const identity = buildTestIdentity('PEREZ GIL ANA - 00000000T')
const writes = ['/documents/', 'registry/?certificate=true', 'signCertificate']

describe('fileRegEntry', () => {
  it('only reads without confirmation', async () => {
    const client = fakeRegClient()
    const result = await fileRegEntry(client, query, {
      identity,
      confirmed: false,
      outDir: dir,
    })
    expect(result.executed).toBe(false)
    expect(result.plan).toContain(
      'Domicilio: Calle Mayor 1, 10001 Prueba (Cáceres)',
    )
    expect(
      client.calls.filter((call) => writes.some((w) => call.url.includes(w))),
    ).toEqual([])
  })

  it('uploads, creates, signs the summary XAdES detached and saves the receipt', async () => {
    const client = fakeRegClient()
    const result = await fileRegEntry(client, query, {
      identity,
      confirmed: true,
      outDir: dir,
    })
    const create = client.calls.find((c) => c.url.endsWith('certificate=true'))
    const entry = JSON.parse(create?.body ?? '{}') as {
      interesteds: { sSurname: string; city: string }[]
      attachments: { uuid: string }[]
    }
    expect(entry.interesteds[0]).toMatchObject({
      sSurname: 'GIL',
      city: '0001',
    })
    expect(entry.attachments.map((a) => a.uuid)).toEqual(['d1'])
    const sign = client.calls.find((c) => c.url.includes('signCertificate/u1'))
    const { xmlSummarySigned } = JSON.parse(sign?.body ?? '{}') as {
      xmlSummarySigned: string
    }
    const xml = Buffer.from(xmlSummarySigned, 'base64').toString()
    expect(xml).toContain('<AFIRMA Id=')
    expect(xml).toContain('xmldsig-more#rsa-sha512')
    expect(result.receipt?.saved).toEqual([
      join(dir, 'v1-JustificanteFirmado.pdf'),
    ])
  })

  it('fails loudly when the API refuses the signature', async () => {
    const client = fakeRegClient([
      (url) => url.includes('signCertificate/'),
      (url) => respondJson(url, { uuid: 'u1', sign: false }),
    ])
    await expect(
      fileRegEntry(client, query, { identity, confirmed: true, outDir: dir }),
    ).rejects.toThrow('signature was refused')
  })
})
