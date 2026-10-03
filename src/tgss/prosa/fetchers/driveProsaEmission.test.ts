import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { ProsaSession } from '../../session/types/ProsaSession'
import { driveProsaEmission } from './driveProsaEmission'

const screen = (ticket: string, xml: string): HttpResponse => {
  const text =
    `<input type="hidden" id="ARQ.SPM.TICKET" value="${ticket}"/>` +
    `<script id="xml" type="text/plain">${xml}</script>`
  return {
    status: 200,
    url: 'https://sp.seg-social.es/ProsaInternet/OnlineAccessUtf8;jsessionid=S1',
    headers: {},
    body: Buffer.from(text),
    text,
  }
}

const session: ProsaSession = { ticket: 't0', sessionId: 'S1', xml: '' }

const clientAnswering = (
  ...screens: readonly HttpResponse[]
): {
  client: HttpClient
  request: ReturnType<typeof vi.fn<HttpClient['request']>>
} => {
  const request = vi.fn<HttpClient['request']>()
  for (const answer of screens) request.mockResolvedValueOnce(answer)
  return { client: { request, cookie: () => undefined }, request }
}

describe('driveProsaEmission', () => {
  it('posts the certificado option with Continuar first', async () => {
    const { client, request } = clientAnswering(
      screen(
        't1',
        '<MESSAGES><MESSAGE><TEXTO><![CDATA[NO]]></TEXTO></MESSAGE></MESSAGES>',
      ),
    )

    const outcome = await driveProsaEmission(client, session, '2')

    expect(outcome).toEqual({ issued: false, message: 'NO' })
    const form = request.mock.calls[0]?.[1]?.form
    expect(form?.['certificado']).toBe('2')
    expect(form?.['SPM.ACC.CONTINUAR']).toBe('CONTINUAR')
  })

  it('sends the extra fields an option needs with the first post', async () => {
    const { client, request } = clientAnswering(
      screen(
        't1',
        '<MESSAGES><MESSAGE><TEXTO><![CDATA[NO]]></TEXTO></MESSAGE></MESSAGES>',
      ),
    )

    await driveProsaEmission(client, session, '2', {
      nifEntidadContratante: 'S2817035E',
    })

    const form = request.mock.calls[0]?.[1]?.form
    expect(form?.['nifEntidadContratante']).toBe('S2817035E')
    expect(form?.['certificado']).toBe('2')
  })

  it('falls back to a fixed message when the portal declines silently', async () => {
    const { client } = clientAnswering(screen('t1', '<ProsaXMLData/>'))

    const outcome = await driveProsaEmission(client, session, '1')

    expect(outcome).toEqual({
      issued: false,
      message: 'TGSS returned no message',
    })
  })

  it('reports the document once Imprimir answers with one', async () => {
    const { client, request } = clientAnswering(
      screen(
        't1',
        '<ProsaXMLData><tipoEjecucion>O</tipoEjecucion></ProsaXMLData>',
      ),
      screen(
        't2',
        '<ProsaXMLData><DOCDocumento>9</DOCDocumento></ProsaXMLData>',
      ),
    )

    const outcome = await driveProsaEmission(client, session, '1')

    expect(outcome).toEqual({
      issued: true,
      xml: '<ProsaXMLData><DOCDocumento>9</DOCDocumento></ProsaXMLData>',
    })
    expect(request.mock.calls[1]?.[1]?.form?.['SPM.ACC.IMPRIMIR']).toBe(
      'IMPRIMIR',
    )
  })

  it('keeps a document that arrives together with an informative message', async () => {
    const { client } = clientAnswering(
      screen(
        't1',
        '<ProsaXMLData><tipoEjecucion>O</tipoEjecucion></ProsaXMLData>',
      ),
      screen(
        't2',
        '<ProsaXMLData><DOCDocumento>9</DOCDocumento>' +
          '<MESSAGES><MESSAGE><TEXTO><![CDATA[Emitido]]></TEXTO></MESSAGE></MESSAGES></ProsaXMLData>',
      ),
    )

    const outcome = await driveProsaEmission(client, session, '3')

    expect(outcome.issued).toBe(true)
  })

  it('stops after the confirmation budget without a document', async () => {
    const pending = screen(
      't',
      '<ProsaXMLData><tipoEjecucion>D</tipoEjecucion></ProsaXMLData>',
    )
    const { client, request } = clientAnswering(
      pending,
      pending,
      pending,
      pending,
      pending,
    )

    const outcome = await driveProsaEmission(client, session, '1')

    expect(request).toHaveBeenCalledTimes(5)
    expect(outcome).toEqual({
      issued: true,
      xml: '<ProsaXMLData><tipoEjecucion>D</tipoEjecucion></ProsaXMLData>',
    })
  })
})
