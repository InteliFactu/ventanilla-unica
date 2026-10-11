import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { buildSelfAssessmentDraft } from './buildSelfAssessmentDraft'

const answer = (text: string, body = Buffer.alloc(0)): HttpResponse => ({
  status: 200,
  url: 'https://www2.agenciatributaria.gob.es/x',
  headers: {},
  body,
  text,
})

const page = String.raw`dt:'z_d1' ['zul.wgt.Button','imp',{sclass:'cmd__importacion'},{},[]] ['zul.wgt.Button','pre',{sclass:'cmd__aeatPresentarBorrador'},{},[]]`
const notice = (tooltip: string, code: string) =>
  String.raw`zclass:'lineasTablaErrores'},{},[['zul.wgt.Image','i',{tooltiptext:'${tooltip}'},{},[]],['zul.wgt.Label','a',{value:'1'},{},[]],['zul.wgt.Label','b',{value:'${code}'},{},[]],['zul.wgt.Label','c',{value:'text'},{},[]]]`
const file = Buffer.from('<T303020263T0000><AUX>')

const fakeClient = (importAnswer: string) => {
  const sids: string[] = []
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options?: HttpRequestOptions) => {
      if (url.endsWith('/A303-FWME/E2026/OPEN/index.zul'))
        return Promise.resolve(answer(page))
      if (url.includes('/dropupload?')) return Promise.resolve(answer(''))
      if (url.endsWith('.pdf'))
        return Promise.resolve(answer('', Buffer.from('%PDF-1.4 x')))
      sids.push(options?.headers?.['ZK-SID'] ?? '')
      return Promise.resolve(
        answer(
          options?.form?.['cmd_0'] === 'onUpload'
            ? importAnswer
            : "src:'/wlpl/A303-FWME/pwda/zkau/view/z_d1/u/1/PDFborrador.pdf'",
        ),
      )
    },
  )
  return {
    client: { request, cookie: () => undefined } satisfies HttpClient,
    request,
    sids,
  }
}

describe('buildSelfAssessmentDraft', () => {
  it('imports, numbers each ZK request and saves the Vista previa', async () => {
    const { client, sids } = fakeClient(
      notice('Aviso', '31190') + notice('Correcto', '00001'),
    )
    const out = await mkdtemp(join(tmpdir(), 'draft-'))
    const draft = await buildSelfAssessmentDraft(client, file, out)
    expect(draft).toMatchObject({
      modelo: '303',
      ejercicio: '2026',
      periodo: '3T',
      imported: true,
    })
    expect(sids).toEqual(['1', '2'])
    // The path comes from the temp directory this test created.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect((await readFile(draft.pdfPath ?? '')).toString()).toMatch(/^%PDF-/)
  })

  it('stops at the notices when the import raised an error', async () => {
    const { client, request } = fakeClient(notice('Error', 'FRECH'))
    const draft = await buildSelfAssessmentDraft(client, file, '/nonexistent')
    expect(draft.imported).toBe(false)
    expect(draft.pdfPath).toBeUndefined()
    expect(request.mock.calls.some(([url]) => url.endsWith('.pdf'))).toBe(false)
  })
})
