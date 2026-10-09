/* eslint-disable security/detect-non-literal-fs-filename -- every path is one this test built under its own temp dir */
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { fakeRegistryClient } from '../registry/fixtures/fakeRegistryClient'
import { postsOf } from '../registry/fixtures/postsOf'
import { fileRelecContribution } from './fileRelecContribution'
import { relecRoutes } from './fixtures/relecRoutes'
import { mapHexText } from './mappers/mapHexText'

const dir = mkdtempSync(join(tmpdir(), 'relec-'))
const first = join(dir, 'Declaración responsable.pdf')
const second = join(dir, 'alta-terceros.pdf')
writeFileSync(first, buildClassicPdf())
writeFileSync(second, buildClassicPdf())
const query = {
  reference: '2026/00000001A',
  documents: [first, second],
  typeCodes: ['DECL', 'ALTER'],
  descriptions: ['Declaración responsable', 'Alta a terceros'],
  information: 'Requerimiento de 02/10/2026',
}
const identity = buildTestIdentity()
const person = '2000400050000000000001'
const writes = [
  '/FileUploader?',
  '/AutofirmaUpload10',
  '/Relec/TramitaSign',
  '/FileUploaderApplet',
  '/Relec/TramitaJustif',
]

describe('fileRelecContribution', () => {
  it('plans from the form without uploading or registering anything', async () => {
    const client = fakeRegistryClient(relecRoutes)
    const result = await fileRelecContribution(client, query, {
      identity,
      confirmed: false,
    })
    expect(result.executed).toBe(false)
    expect(result.filing).toMatchObject({
      host: 'sede.caceres.es',
      procedure: 'Aportación de documentación',
      reference: '2026/00000001A',
      representative: { name: 'ANA LOPEZ RUIZ', nif: '12345678Z' },
      represented: { name: 'EJEMPLO SL', nif: 'B12345678', dboid: person },
      email: 'ana@example.es',
      phone: '600000000',
    })
    expect(
      result.filing.documents.map((document) => [
        document.uploadName,
        document.typeCode,
        document.typeDboid,
      ]),
    ).toEqual([
      ['Declaracinresponsable.pdf', 'DECL', '2017000000004854907935'],
      ['alta-terceros.pdf', 'ALTER', '2017000000554417907935'],
    ])
    expect(result.filing.documents[0]?.sha256).toMatch(/^[\da-f]{64}$/)
    expect(result.plan[1]).toBe(
      'As ANA LOPEZ RUIZ (12345678Z), representing EJEMPLO SL (B12345678)',
    )
    const posts = postsOf(client).map((call) => call.url)
    expect(posts).toEqual([
      'https://sede.caceres.es/sta/frame.jsp',
      'https://sede.caceres.es/sta/ApordocAjaxLoader?getTypes=0',
    ])
    expect(
      posts.some((url) => writes.some((write) => url.includes(write))),
    ).toBe(false)
  })

  it('uploads, signs, submits and registers in the browser order', async () => {
    const client = fakeRegistryClient(relecRoutes)
    const result = await fileRelecContribution(
      client,
      { ...query, email: 'otro@example.es' },
      { identity, confirmed: true },
    )
    expect(result.receipt).toMatchObject({
      csv: '11112222333344445555',
      nif: 'B1234567',
      answeredAt: '2026-10-02T14:45:23.387Z',
      justificanteUrl:
        'https://sede.caceres.es/sta/Utils/DocumentCheck?ACTION=view&CUD=11112222333344445555&NIF=B1234567&method=download&name=APORTACION',
    })
    expect(result.notes).toEqual([
      expect.stringContaining('names no registry number'),
    ])
    const posts = postsOf(client)
    const path = (url: string): string => new URL(url).pathname
    expect(posts.map((call) => path(call.url))).toEqual([
      '/sta/frame.jsp',
      '/sta/ApordocAjaxLoader',
      '/sta/FileUploader',
      '/sta/AutofirmaDownload10',
      '/sta/AutofirmaUpload10',
      '/sta/FileUploader',
      '/sta/AutofirmaDownload10',
      '/sta/AutofirmaUpload10',
      '/sta/Relec/TramitaSign',
      '/sta/FileUploaderApplet',
      '/sta/FileUploaderApplet',
      '/sta/Relec/TramitaJustif',
    ])
  })

  it('sends each document, the form and the signed XML as the browser does', async () => {
    const client = fakeRegistryClient(relecRoutes)
    await fileRelecContribution(
      client,
      { ...query, email: 'otro@example.es' },
      { identity, confirmed: true },
    )
    const posts = postsOf(client).map((call) => call.body)
    const urls = postsOf(client).map((call) => call.url)
    const hex = mapHexText('Declaracinresponsable.pdf')
    expect(urls[2]).toBe(
      `https://sede.caceres.es/sta/FileUploader?file=${hex}&action=savefile&sessionid=ABCDEF0123&tipo=0&maxSize=50000&checkPdf=true&accionfirma=firma&signatureField=Telematico`,
    )
    expect(posts[2]).toContain('filename="Declaracinresponsable.pdf"')
    const signedPdf = Buffer.from(String(posts[4]), 'base64').toString('latin1')
    expect(signedPdf).toContain('/ByteRange')
    const sign = String(posts[8])
    for (const pair of [
      'tipoActuacion=R',
      `SELECTED_PERSON=${person}`,
      `representados=${person}`,
      'tipoPersonaRepresented=RJ',
      'RepCIF=B1234567&RepCIFCtrlDigit=8',
      'RepRazonSoc=EJEMPLO+SL',
      'RepresentadotipoVia=ALMDA',
      'contact21=otro%40example.es&info21=on',
      'direcciones=1009000000000000000001&pais=ESPA%D1A',
      'calle=MAYOR+%26+SOL',
      'contact1=600000000&info1=on',
      'aportadoc_modo=libre&cod_requerimiento=&referenciaAporDoc=2026%2F00000001A',
      `0_${person}description=Declaraci%F3n+responsable`,
      `0_${person}file=${hex}`,
      `2_${person}tipo=2017000000004854907935&2_${person}description=&0_${person}firma=true`,
      'lopdok=on',
    ])
      expect(sign).toContain(pair)
    const signedXml = Buffer.from(String(posts[10]), 'base64').toString()
    expect(signedXml).toMatch(/<ds:Signature [\s\S]*<\/ds:Signature><\/REGIS>$/)
    expect(posts[11]).toContain(
      'dboidSolicitud=6269000000002829307935&showApplet=false',
    )
  })

  it('saves the justificante and a JSON receipt under --out', async () => {
    const out = mkdtempSync(join(tmpdir(), 'relec-out-'))
    const client = fakeRegistryClient(relecRoutes)
    const result = await fileRelecContribution(client, query, {
      identity,
      confirmed: true,
      outDir: out,
    })
    expect(readdirSync(out).toSorted()).toEqual([
      'aportacion-11112222333344445555.json',
      'justificante-11112222333344445555.pdf',
    ])
    expect(result.receipt?.justificante).toBe(
      join(out, 'justificante-11112222333344445555.pdf'),
    )
    const saved = JSON.parse(
      readFileSync(join(out, 'aportacion-11112222333344445555.json'), 'utf8'),
    ) as { receipt: { csv: string } }
    expect(saved.receipt.csv).toBe('11112222333344445555')
  })
})
