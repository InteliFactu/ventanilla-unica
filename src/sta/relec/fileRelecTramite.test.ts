/* eslint-disable security/detect-non-literal-fs-filename -- paths belong to this test's temporary directory */
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { fakeRegistryClient } from '../registry/fixtures/fakeRegistryClient'
import { postsOf } from '../registry/fixtures/postsOf'
import { respondWith } from '../registry/fixtures/respondWith'
import { fileRelecTramite } from './fileRelecTramite'
import { relecRoutes } from './fixtures/relecRoutes'
import { relecTramiteFormHtml } from './fixtures/relecTramiteFormHtml'
import { relecTramiteRoutes } from './fixtures/relecTramiteRoutes'

const dir = mkdtempSync(join(tmpdir(), 'relec-tramite-'))
const pdf = join(dir, 'application.pdf')
writeFileSync(pdf, buildClassicPdf())
const identity = buildTestIdentity()
const query = {
  dboid: '6269000000000000000001',
  subject: 'Test catalogue filing',
  documents: [pdf],
  rows: ['Application'],
}
describe('fileRelecTramite', () => {
  it('reads the holder contact script after opening the form, excluding representative defaults', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.includes('/Relec/TramitaForm'),
        (url) =>
          respondWith(
            url,
            relecTramiteFormHtml.replace(
              '<head>',
              '<head><script src="../pages/relec/form/contactways_js.jsp"></script>',
            ),
          ),
      ],
      [
        (url) => url.includes('/contactways_js.jsp'),
        (url) =>
          respondWith(
            url,
            `function loadContactsFrom(tipo) {
          if(tipo=="representante") { $("contact21").value="representative@example.es"; }
          else if(tipo=="interesado") { $("contact21").value="holder@example.es"; }
          if(tipo=="representante") { $("contact1").value="699999999"; }
          else if(tipo=="interesado") { $("contact1").value="611111111"; }
        }
        function resetContacts() { $("contact21").value=""; }`,
          ),
      ],
      ...relecRoutes,
    ])
    const result = await fileRelecTramite(client, query, {
      identity,
      confirmed: false,
    })
    expect(result.filing).toMatchObject({
      email: 'holder@example.es',
      phone: '611111111',
    })
  })

  it('plans in the holder name with no upload, signing POST or registration', async () => {
    const client = fakeRegistryClient(relecTramiteRoutes)
    const result = await fileRelecTramite(client, query, {
      identity,
      confirmed: false,
      outDir: join(dir, 'must-not-exist'),
    })
    expect(result).toMatchObject({
      action: 'caceres tramite',
      executed: false,
      filing: {
        dboid: query.dboid,
        filer: { name: 'ANA LOPEZ RUIZ', nif: '12345678Z' },
        represented: undefined,
        missingRequired: [],
        documents: [{ slot: { dboid: '61', required: true } }],
      },
    })
    expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual([
      '/sta/frame.jsp',
    ])
    // eslint-disable-next-line @typescript-eslint/unbound-method -- the synthetic request is a vi.fn
    expect(vi.mocked(client.request).mock.calls).toHaveLength(3)
    expect(readdirSync(dir)).not.toContain('must-not-exist')
  })

  it.each([
    [['62'], 'Missing required slots: Application'],
    [['Unknown'], 'no row'],
    [['61', 'Application'], 'one PDF per slot'],
  ])(
    'rejects unsafe slot mapping %j before uploading',
    async (rows, message) => {
      const client = fakeRegistryClient(relecTramiteRoutes)
      await expect(
        fileRelecTramite(
          client,
          { ...query, rows, documents: rows.map(() => pdf) },
          { identity, confirmed: true },
        ),
      ).rejects.toThrow(message)
      expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual(
        ['/sta/frame.jsp'],
      )
    },
  )

  it('reuses local PDF/XML signing and saves a receipt after confirmed registration', async () => {
    const client = fakeRegistryClient(relecTramiteRoutes)
    const outDir = mkdtempSync(join(tmpdir(), 'relec-tramite-out-'))
    const result = await fileRelecTramite(client, query, {
      identity,
      confirmed: true,
      outDir,
    })
    expect(result.executed).toBe(true)
    expect(result.receipt?.csv).toBe('11112222333344445555')
    // eslint-disable-next-line @typescript-eslint/unbound-method -- the synthetic request is a vi.fn
    const calls = vi.mocked(client.request).mock.calls
    const popup = calls.find(([url]) => url.includes('/documentSignSend.jsp'))
    expect(popup?.[0]).toContain('tipoDocumento=61&firma=S&extensions=pdf')
    expect(popup?.[0]).toContain('personDBOID=2000400000000000000009')
    expect(popup?.[0]).not.toContain('indice=')
    const posts = postsOf(client)
    expect(posts.map((call) => new URL(call.url).pathname)).toEqual([
      '/sta/frame.jsp',
      '/sta/FileUploader',
      '/sta/AutofirmaDownload10',
      '/sta/AutofirmaUpload10',
      '/sta/Relec/TramitaSign',
      '/sta/FileUploaderApplet',
      '/sta/FileUploaderApplet',
      '/sta/Relec/TramitaJustif',
    ])
    expect(posts[1]?.url).toContain('tipo=61')
    expect(posts[2]?.url).toContain('dboidType=61')
    expect(
      Buffer.from(String(posts[3]?.body), 'base64').toString('latin1'),
    ).toContain('/ByteRange')
    const body = new URLSearchParams(String(posts[4]?.body))
    expect(Object.fromEntries(body)).toMatchObject({
      tipoActuacion: 'I',
      SELECTED_PERSON: '2000400000000000000009',
      DinVarANNOT_TEXT_EXTRACT: 'Test catalogue filing',
      '61_2000400000000000000009DocReq': '61',
      '61_2000400000000000000009pid': 'false',
      '61_2000400000000000000009CUD': '',
      '61_2000400000000000000009tipo': '2017000000004854907935',
      '61_2000400000000000000009file': '6170706c69636174696f6e2e706466',
      '61_2000400000000000000009firma': 'true',
      '62_2000400000000000000009file': '',
    })
    expect(body.has('representados')).toBe(false)
    expect(body.has('RepCIF')).toBe(false)
    expect(body.has('hasRepresentative')).toBe(false)
    expect(Buffer.from(String(posts[6]?.body), 'base64').toString()).toContain(
      '<ds:Signature ',
    )
    expect(readdirSync(outDir).toSorted()).toEqual([
      'aportacion-11112222333344445555.json',
      'justificante-11112222333344445555.pdf',
    ])
    expect(
      JSON.parse(
        readFileSync(
          join(outDir, 'aportacion-11112222333344445555.json'),
          'utf8',
        ),
      ),
    ).toMatchObject({
      filing: { dboid: query.dboid, subject: query.subject },
      receipt: { csv: '11112222333344445555' },
    })
  })
})
