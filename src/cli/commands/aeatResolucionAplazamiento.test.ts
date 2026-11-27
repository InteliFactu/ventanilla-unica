/* eslint-disable security/detect-non-literal-fs-filename -- test paths belong to this suite's temporary directory */
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { readAeatAgreementResolution } from '../../aeat/debts/readAeatAgreementResolution'
import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { aeatResolucionAplazamiento } from './aeatResolucionAplazamiento'

const base = 'https://www1.agenciatributaria.gob.es'
const sraf = `${base}/wlpl/inwinvoc/es.aeat.dit.adu.sraf`
const agreement = '100000000001A'
const other = '100000000002B'
const detail = `${sraf}.acuerdo.AcuAccDeta?fAccion=deta&cacuerdo=${agreement}&fFigura=obli`
const listing = htmlResponse(
  `${sraf}.solicitud.SolAccionW?fAccion=petic&fFigura=obli`,
  `<a href="${detail.replace(agreement, other)}">${other}</a><a href="${detail}">${agreement}</a>`,
)
const resolution = `${sraf}.acuerdo.AcuAccionW?fAccion=verpdfres&fcerti=11111111111111111111111111&cdacu=313030303030303030303031412020`
const session = htmlResponse(`${base}/wlpl/BUGC-JDIT/MdcAcceso`, '')
const pdf = buildClassicPdf()
const pdfAnswer = { ...htmlResponse(resolution, ''), body: pdf }

describe('AEAT deferral resolution', () => {
  it('reads the listed agreement and follows only its advertised resolution', async () => {
    const link = `<a href="#" onclick="Ventana('${resolution.replaceAll('&', '&amp;')}');return false;">Ver resolución</a>`
    const client = scriptedClient(
      session,
      listing,
      htmlResponse(detail, `${link}<a href="${resolution}">Ver resolución</a>`),
      pdfAnswer,
    )

    await expect(
      readAeatAgreementResolution(client, agreement),
    ).resolves.toEqual(pdf)
    expect(client.request.mock.calls.map(([url]) => url)).toEqual([
      session.url,
      listing.url,
      detail,
      resolution,
    ])
    expect(client.request.mock.calls.at(-1)).toEqual([
      resolution,
      { followRedirects: false },
    ])
  })

  it('stops if the holder does not list the requested agreement', async () => {
    const client = scriptedClient(session, listing)
    await expect(
      readAeatAgreementResolution(client, '100000000003C'),
    ).rejects.toThrow('agreement is not listed')
    expect(client.request.mock.calls).toHaveLength(2)
  })

  it('resolves a relative resolution link against the listed detail page', async () => {
    const relative = resolution.slice(resolution.lastIndexOf('/') + 1)
    const client = scriptedClient(
      session,
      listing,
      htmlResponse(detail, `<a href="${relative}">Ver resolución</a>`),
      pdfAnswer,
    )
    await expect(
      readAeatAgreementResolution(client, agreement),
    ).resolves.toEqual(pdf)
    expect(client.request.mock.calls.at(-1)).toEqual([
      resolution,
      { followRedirects: false },
    ])
  })

  it('ignores hidden links, another agreement, another host and unrelated actions', async () => {
    const client = scriptedClient(
      session,
      listing,
      htmlResponse(
        detail,
        `
        <div hidden><a href="${resolution}">Hidden</a></div>
        <a href="${resolution.replace('3141', '3242')}">Other agreement</a>
        <a href="${resolution.replace(base, 'https://example.invalid')}">Other host</a>
        <a href="${resolution.replace('verpdfres', 'otro')}">Other action</a>
      `,
      ),
    )
    await expect(
      readAeatAgreementResolution(client, agreement),
    ).rejects.toThrow('no resolution PDF is listed')
    expect(client.request.mock.calls).toHaveLength(3)
  })

  it('refuses conflicting resolution links for one agreement', async () => {
    const otherResolution = resolution.replace('&fcerti=1', '&fcerti=2')
    const client = scriptedClient(
      session,
      listing,
      htmlResponse(
        detail,
        `<a href="${resolution}">One</a><a href="${otherResolution}">Two</a>`,
      ),
    )
    await expect(
      readAeatAgreementResolution(client, agreement),
    ).rejects.toThrow('multiple resolution PDFs are listed')
    expect(client.request.mock.calls).toHaveLength(3)
  })

  it.each([htmlResponse(resolution, 'Login'), { ...pdfAnswer, status: 302 }])(
    'refuses a response that is not a successful PDF (status $status)',
    async (response) => {
      const client = scriptedClient(
        session,
        listing,
        htmlResponse(detail, `<a href="${resolution}">Ver resolución</a>`),
        response,
      )
      await expect(
        readAeatAgreementResolution(client, agreement),
      ).rejects.toThrow('no PDF returned for the agreement resolution')
    },
  )

  it('requires a valid agreement code before making a request', async () => {
    const client = scriptedClient()
    await expect(
      readAeatAgreementResolution(client, '../example'),
    ).rejects.toThrow('agreement code')
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('saves only the resolution with private permissions and preserves an existing file', async () => {
    const out = await mkdtemp(join(tmpdir(), 'aeat-resolution-test-'))
    try {
      const responses = [
        session,
        listing,
        htmlResponse(detail, `<a href="${resolution}">Ver resolución</a>`),
        pdfAnswer,
      ]
      const path = join(out, `aeat-resolucion-${agreement}.pdf`)
      await expect(
        aeatResolucionAplazamiento.run(scriptedClient(...responses), {
          acuerdo: agreement,
          out,
        }),
      ).resolves.toEqual({ agreement, path, bytes: pdf.length })
      expect(await readFile(path)).toEqual(pdf)
      expect((await stat(path)).mode & 0o777).toBe(0o600)
      await expect(
        aeatResolucionAplazamiento.run(scriptedClient(...responses), {
          acuerdo: agreement,
          out,
        }),
      ).rejects.toThrow('EEXIST')
      expect(await readFile(path)).toEqual(pdf)
    } finally {
      await rm(out, { recursive: true, force: true })
    }
  })
})
