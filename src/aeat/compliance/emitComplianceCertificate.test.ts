import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { deflateSync } from 'node:zlib'

import { afterEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { emitComplianceCertificate } from './emitComplianceCertificate'

const page = (text: string): HttpResponse => ({
  status: 200,
  url: '',
  headers: {},
  body: Buffer.from(text, 'latin1'),
  text,
})

const certificatePdf = (sign: string): HttpResponse => {
  const content = deflateSync(
    Buffer.from(
      `BT (tiene car\\341cter ${sign} y una validez) Tj ET`,
      'latin1',
    ),
  )
  const body = Buffer.concat([
    Buffer.from('%PDF-1.4\n<< /Filter /FlateDecode >>\nstream\n', 'latin1'),
    content,
    Buffer.from('\nendstream\n%%EOF', 'latin1'),
  ])
  return { ...page(''), body }
}

const entryHtml = "<input type='hidden' name='fIslw' value='tok=='>"
const confirmationHtml = `<script>var _fbNombre="ACME SL"; var _fbNif="B00000000";</script>
<form id='Form'>
<input type='hidden' name='fTipoCertificado' value='Contratos sector público'>
<input type='hidden' name='FIRNIF' value=''>
<input type='hidden' name='FIRNOMBRE' value=''>
<input type='hidden' name='FIR' value=''>
</form>`

const buildRequest = (bodies: string[], sign: string) =>
  vi.fn<HttpClient['request']>(async (url, options) => {
    if (url.endsWith('/BUGC-JDIT/MdcAcceso')) return Promise.resolve(page(''))
    if (url.endsWith('/CotejoDocIdSv?CSV=ABCD1234EFGH5678'))
      return Promise.resolve(certificatePdf(sign))
    if (url.endsWith('/EMCE-JDIT/ECOTInternetCiudadanosServlet')) {
      if (options?.method !== 'POST') return Promise.resolve(page(entryHtml))
      bodies.push(options.body ?? '')
      return Promise.resolve(
        page(bodies.length === 1 ? confirmationHtml : 'CSV=ABCD1234EFGH5678'),
      )
    }
    throw new Error(`unexpected request: ${url}`)
  })

const clientFor = (bodies: string[], sign: string): HttpClient => ({
  request: buildRequest(bodies, sign),
  cookie: () => undefined,
})

describe('emitComplianceCertificate', () => {
  let dir: string | undefined

  afterEach(async () => {
    vi.useRealTimers()
    if (dir) await rm(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('validates the purpose, signs as the holder and reads a POSITIVO', async () => {
    const bodies: string[] = []
    const result = await emitComplianceCertificate(
      clientFor(bodies, 'POSITIVO'),
      { nif: 'B00000000', purpose: 'contratacion' },
      undefined,
    )

    expect(bodies[0]).toContain('fTipoCertificado=C1')
    expect(bodies[0]).toContain('fAccion=2&fIslw=tok%3D%3D')
    expect(bodies[1]).toBe(
      'fTipoCertificado=Contratos%20sector%20p%FAblico&FIRNIF=B00000000&FIRNOMBRE=ACME%20SL&FIR=FirmaBasica',
    )
    expect(result).toMatchObject({
      nif: 'B00000000',
      nombre: 'ACME SL',
      purpose: 'contratacion',
      csv: 'ABCD1234EFGH5678',
      positive: true,
      pdfPath: undefined,
    })
  })

  it('returns a NEGATIVO certificate and writes it dated in Madrid', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-02T22:30:00Z'))
    dir = await mkdtemp(join(tmpdir(), 'corriente-'))

    const result = await emitComplianceCertificate(
      clientFor([], 'NEGATIVO'),
      { nif: 'B00000000', purpose: 'subvenciones' },
      dir,
    )

    expect(result.positive).toBe(false)
    expect(result.pdfPath).toBe(
      join(dir, 'aeat-corriente-subvenciones-B00000000-2026-10-03.pdf'),
    )
  })

  it('refuses before signing when the certificate acts for someone else', async () => {
    const bodies: string[] = []

    await expect(
      emitComplianceCertificate(
        clientFor(bodies, 'POSITIVO'),
        { nif: 'A11111111', purpose: 'generico' },
        undefined,
      ),
    ).rejects.toThrow(/acts for B00000000/)
    expect(bodies).toHaveLength(1)
  })
})
