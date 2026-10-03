import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { emitCensalCertificate } from './emitCensalCertificate'

const page = (text: string, status = 200): HttpResponse => ({
  status,
  url: '',
  headers: {},
  body: Buffer.from(text, 'latin1'),
  text,
})

const entryHtml = "<input type='hidden' name='fIslw' value='tok=='>"
const confirmationHtml = `<form id='Form'>
<input type='hidden' name='fProcedimiento' value='Certificados de situación censal'>
<input type='text' name='FIRNIF' value=''>
<input type='text' name='FIRNOMBRE' value=''>
<input type='hidden' name='FIR' value=''>
</form>`
const receiptHtml = '<p>Código Seguro de Verificación: CSV=ABCD1234EFGH5678</p>'

const buildRequest = (bodies: string[]) =>
  vi.fn<HttpClient['request']>(async (url, options) => {
    if (url.endsWith('/BUGC-JDIT/MdcAcceso')) return Promise.resolve(page(''))
    if (url.includes('/KATA-APLI/cotejo/CotejoDocIdSv?CSV=ABCD1234EFGH5678'))
      return Promise.resolve(page('%PDF-1.4 certificate'))
    if (url.endsWith('/EMCE-JDIT/ServletSitCenInternet')) {
      if (options?.method !== 'POST') return Promise.resolve(page(entryHtml))
      bodies.push(String(options.body ?? ''))
      return Promise.resolve(
        page(bodies.length === 1 ? confirmationHtml : receiptHtml),
      )
    }
    throw new Error(`unexpected request: ${url}`)
  })

const request = { nif: 'B00000000', nombre: 'ACME SL' }

describe('emitCensalCertificate', () => {
  let dir: string | undefined

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('validates, signs in Latin-1 and returns the CSV with the PDF size', async () => {
    const bodies: string[] = []
    const client: HttpClient = {
      request: buildRequest(bodies),
      cookie: () => undefined,
    }

    const result = await emitCensalCertificate(client, request, undefined)

    expect(result.csv).toBe('ABCD1234EFGH5678')
    expect(result.bytes).toBe('%PDF-1.4 certificate'.length)
    expect(result.pdfPath).toBeUndefined()
    expect(bodies[0]).toContain('fAccion=2&fIslw=tok%3D%3D')
    expect(bodies[1]).toBe(
      'fProcedimiento=Certificados%20de%20situaci%F3n%20censal&FIRNIF=B00000000&FIRNOMBRE=ACME%20SL&FIR=FirmaBasica',
    )
    expect(result.notes).toHaveLength(2)
  })

  it('writes the PDF when --out is given', async () => {
    dir = await mkdtemp(join(tmpdir(), 'censal-'))
    const client: HttpClient = {
      request: buildRequest([]),
      cookie: () => undefined,
    }

    const result = await emitCensalCertificate(client, request, dir)

    expect(result.pdfPath).toBe(
      join(dir, 'aeat-censal-B00000000-ABCD1234EFGH5678.pdf'),
    )
  })

  it('throws when the entry page carries no token', async () => {
    const request2 = vi.fn<HttpClient['request']>(async () =>
      Promise.resolve(page('<html>denegado</html>')),
    )
    const client: HttpClient = { request: request2, cookie: () => undefined }

    await expect(
      emitCensalCertificate(client, request, undefined),
    ).rejects.toThrow(/no fIslw token/)
  })

  it('throws when the signed request answers without a CSV', async () => {
    let posts = 0
    const request2 = vi.fn<HttpClient['request']>(async (url, options) => {
      if (options?.method === 'POST') {
        posts += 1
        return Promise.resolve(
          page(posts === 1 ? confirmationHtml : '<p>error</p>'),
        )
      }
      return Promise.resolve(page(url.endsWith('/MdcAcceso') ? '' : entryHtml))
    })
    const client: HttpClient = { request: request2, cookie: () => undefined }

    await expect(
      emitCensalCertificate(client, request, undefined),
    ).rejects.toThrow(/without a CSV/)
  })
})
