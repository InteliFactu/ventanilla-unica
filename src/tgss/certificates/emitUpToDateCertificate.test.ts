import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { emitUpToDateCertificate } from './emitUpToDateCertificate'

const page = (url: string, text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.from(text),
  text,
})

const prosaHtml = (ticket: string, xml: string): string =>
  `<html><input type="hidden" id="ARQ.SPM.TICKET" value="${ticket}"/>` +
  `<script id="xml" type="text/plain">${xml}</script></html>`

const postFormUrl =
  'https://sp.seg-social.es/ProsaInternet/OnlineAccessUtf8;jsessionid=S1'
const viewDocUrl =
  'https://sp.seg-social.es/ProsaInternet/ViewDocUtf8;jsessionid=S1'

const loginThen = (
  ...screens: readonly HttpResponse[]
): ReturnType<typeof vi.fn<HttpClient['request']>> => {
  const request = vi
    .fn<HttpClient['request']>()
    .mockResolvedValueOnce(
      page(
        'https://idp.seg-social.es/PGIS/Login',
        '<a href="/PGIS/Login?seleccion=IPCE">Certificado</a>',
      ),
    )
    .mockResolvedValueOnce(
      page(
        'https://idp.seg-social.es/PGIS/Login?seleccion=IPCE',
        '<form action="https://ipce.seg-social.es/IPCE/Login">' +
          '<input type="hidden" name="SAMLRequest" value="req1"></form>',
      ),
    )
    .mockResolvedValueOnce(
      page(
        'https://sp.seg-social.es/ProsaInternet/OnlineAccess?ok=1',
        prosaHtml('t0', '<ProsaXMLData/>'),
      ),
    )
  for (const answer of screens) request.mockResolvedValueOnce(answer)
  return request
}

describe('emitUpToDateCertificate', () => {
  let dir: string | undefined

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true })
    dir = undefined
  })

  it('refuses a dated kind before logging in', async () => {
    const request = vi.fn<HttpClient['request']>()
    const client: HttpClient = { request, cookie: () => 'S1' }

    await expect(
      emitUpToDateCertificate(client, '12345678Z', 'sin-deuda-fecha'),
    ).rejects.toThrow(/needs a reference date/)
    expect(request).not.toHaveBeenCalled()
  })

  it('refuses the tender kind without the contracting entity before logging in', async () => {
    const request = vi.fn<HttpClient['request']>()
    const client: HttpClient = { request, cookie: () => 'S1' }

    await expect(
      emitUpToDateCertificate(client, 'B22903801', 'licitacion'),
    ).rejects.toThrow(/contracting entity NIF/)
    expect(request).not.toHaveBeenCalled()
  })

  it('reports the portal message when the certificate is declined', async () => {
    const declined =
      '<MESSAGES><MESSAGE><TEXTO><![CDATA[Se ha superado en el día de hoy el número máximo de peticiones permitidas]]></TEXTO></MESSAGE></MESSAGES>'
    const request = loginThen(page(postFormUrl, prosaHtml('t1', declined)))
    const client: HttpClient = { request, cookie: () => 'S1' }

    const result = await emitUpToDateCertificate(
      client,
      '12345678Z',
      'generico',
    )

    expect(result).toEqual({
      nif: '12345678Z',
      kind: 'generico',
      label: 'Genérico',
      issued: false,
      message:
        'Se ha superado en el día de hoy el número máximo de peticiones permitidas',
      notes: [
        'every emission counts against the portal daily cap per subject (about three)',
        'an issued certificate can be NEGATIVO (holder not up to date); the sign is only in the PDF text',
      ],
    })
    expect(request.mock.calls[3]?.[1]?.form?.['certificado']).toBe('1')
  })

  it('downloads the certificate PDF into --out', async () => {
    const request = loginThen(
      page(
        postFormUrl,
        prosaHtml(
          't1',
          '<ProsaXMLData><tipoEjecucion>O</tipoEjecucion></ProsaXMLData>',
        ),
      ),
      page(
        postFormUrl,
        prosaHtml(
          't2',
          '<ProsaXMLData><DOCDocumento>1</DOCDocumento></ProsaXMLData>',
        ),
      ),
      page(viewDocUrl, '%PDF-1.4 fixture'),
    )
    const client: HttpClient = { request, cookie: () => 'S1' }
    dir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-tgss-'))

    const result = await emitUpToDateCertificate(
      client,
      '12345678Z',
      'subvenciones',
      { outDir: dir },
    )

    expect(request.mock.calls[3]?.[1]?.form?.['certificado']).toBe('3')
    expect(result.issued).toBe(true)
    expect(result.bytes).toBe('%PDF-1.4 fixture'.length)
    expect(result.pdfPath).toBe(
      join(dir, 'tgss-corriente-subvenciones-12345678Z.pdf'),
    )
  })

  it('skips the file when no --out was given', async () => {
    const request = loginThen(
      page(
        postFormUrl,
        prosaHtml(
          't1',
          '<ProsaXMLData><tipoEjecucion>O</tipoEjecucion></ProsaXMLData>',
        ),
      ),
      page(
        postFormUrl,
        prosaHtml(
          't2',
          '<ProsaXMLData><DOCDocumento>1</DOCDocumento></ProsaXMLData>',
        ),
      ),
      page(viewDocUrl, '%PDF-1.4 fixture'),
    )
    const client: HttpClient = { request, cookie: () => 'S1' }

    const result = await emitUpToDateCertificate(
      client,
      '12345678Z',
      'generico',
    )

    expect(result.issued).toBe(true)
    expect(result.pdfPath).toBeUndefined()
  })
})
