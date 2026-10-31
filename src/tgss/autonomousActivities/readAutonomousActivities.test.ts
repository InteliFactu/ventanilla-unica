import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { readAutonomousActivities } from './readAutonomousActivities'

vi.mock('../session/loginToImportass', () => ({
  loginToImportass: vi.fn(async () => Promise.resolve()),
}))

const pageUrl =
  'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/informeVariasActividadesRETA'
const pageHtml =
  '<base href="https://portal.seg-social.gob.es/wps/myportal/importass/x/"><button onclick=\'descargaDoc(this,"p0/IZ7_A=NJgenDoc=Eaccion!ACC_DESCARGAR_DECLARACION==/")\'>Descargar informe</button>'

const response = (url: string, body: Buffer): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body,
  text: body.toString('utf8'),
})

const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }

describe('readAutonomousActivities', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('downloads the report from the button URL and saves it under --out', async () => {
    const pdf = Buffer.from('%PDF-1.4 actividades')
    request
      .mockResolvedValueOnce(response(pageUrl, Buffer.from(pageHtml)))
      .mockResolvedValueOnce(
        response('https://portal.seg-social.gob.es/pdf', pdf),
      )
    const outDir = await mkdtemp(join(tmpdir(), 'actividades-'))

    const result = await readAutonomousActivities(client, outDir)

    expect(request).toHaveBeenNthCalledWith(
      2,
      'https://portal.seg-social.gob.es/wps/myportal/importass/x/p0/IZ7_A=NJgenDoc=Eaccion!ACC_DESCARGAR_DECLARACION==/',
      { referer: pageUrl },
    )
    expect(result.bytes).toBe(pdf.length)
    expect(result.pdfPath).toBe(join(outDir, 'tgss-actividades-autonomo.pdf'))
  })

  it('saves nothing without --out', async () => {
    request
      .mockResolvedValueOnce(response(pageUrl, Buffer.from(pageHtml)))
      .mockResolvedValueOnce(
        response('https://portal.seg-social.gob.es/pdf', Buffer.from('%PDF-x')),
      )
    await expect(
      readAutonomousActivities(client, undefined),
    ).resolves.toMatchObject({ pdfPath: undefined, bytes: 6 })
  })

  it('fails when the page has no download button', async () => {
    request.mockResolvedValueOnce(
      response(pageUrl, Buffer.from('<p>error</p>')),
    )
    await expect(readAutonomousActivities(client, undefined)).rejects.toThrow(
      /offers no download/,
    )
  })

  it('fails when the download is not a PDF', async () => {
    request
      .mockResolvedValueOnce(response(pageUrl, Buffer.from(pageHtml)))
      .mockResolvedValueOnce(
        response('https://portal.seg-social.gob.es/pdf', Buffer.from('<html>')),
      )
    await expect(readAutonomousActivities(client, undefined)).rejects.toThrow(
      /no PDF returned/,
    )
  })
})
