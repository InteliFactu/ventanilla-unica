import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { confirmStaContactData } from './confirmStaContactData'
import { gateButtonHtml } from './fixtures/gateButtonHtml'

const origin = 'https://sede.caceres.es'
const gate = `${origin}/sta/CarpetaPrivate/doEvent?APP_CODE=STA&PAGE_CODE=CONFIRMACION_DATOS_PERSONALES`
const home = `${origin}/sta/CarpetaPrivate/doEvent?APP_CODE=STA&PAGE_CODE=HOME`
const query = { phone: '600000000', email: 'a@example.es' }

const page = (url: string, extra = ''): HttpResponse => {
  const text = `<a href="/sta/CarpetaPrivate/Logout?EXIT=true">Salir</a>${extra}`
  return { status: 200, url, headers: {}, body: Buffer.from(text), text }
}

/**
 * A client whose logins land on `landings` in turn, the gate showing
 * "Guardar"; its POSTs answer "SÍ", then "Aceptar", then nothing.
 */
const clientLanding = (...landings: string[]): HttpClient => {
  const queue = [...landings]
  const zones = [
    gateButtonHtml('PERSCONTACT', 'PERSCONTACT_NO', 'NO') +
      gateButtonHtml('PERSCONTACT', 'PERSCONTACT_YES', 'SÍ'),
    gateButtonHtml('PERSIDENT', 'PERSIDENT_OK', 'Aceptar'),
  ]
  return {
    request: vi
      .fn<HttpClient['request']>()
      .mockImplementation(async (url, options) => {
        if (options?.method === 'POST')
          return Promise.resolve(page(url, zones.shift() ?? ''))
        const landing = queue.shift() ?? home
        const extra =
          landing === gate
            ? gateButtonHtml('PERSCONTACT', 'PERSCONTACT_ADD', 'Guardar')
            : ''
        return Promise.resolve(page(landing, extra))
      }),
    cookie: () => undefined,
  }
}

const posts = (client: HttpClient): unknown[] =>
  (client.request as ReturnType<typeof vi.fn<HttpClient['request']>>).mock.calls
    .filter(([, options]) => options?.method === 'POST')
    .map(([, options]) => options?.form)

describe('confirmStaContactData', () => {
  it('says there is nothing to confirm when the gate is down', async () => {
    const client = clientLanding(home)
    const result = await confirmStaContactData(client, 'caceres', query, true)
    expect(result.executed).toBe(false)
    expect(result.plan).toEqual([
      'sede.caceres.es asks for no contact data: nothing to confirm',
    ])
    expect(posts(client)).toEqual([])
  })

  it('only plans without confirmation', async () => {
    const client = clientLanding(gate)
    const result = await confirmStaContactData(client, 'caceres', query, false)
    expect(result.plan).toEqual([
      'Save contact data at sede.caceres.es: e-mail a@example.es, phone 600000000',
      'Then answer the gate: contact data correct, identification data accepted',
    ])
    expect(posts(client)).toEqual([])
  })

  it('saves the contact data and checks the session then opens', async () => {
    const client = clientLanding(gate, home)
    const result = await confirmStaContactData(client, 'caceres', query, true)
    expect(result.receipt).toEqual({
      steps: ['PERSCONTACT_ADD', 'PERSCONTACT_YES', 'PERSIDENT_OK'],
      sessionOpens: true,
    })
    expect(posts(client)[0]).toMatchObject({
      eventAction: 'PERSCONTACT_ADD',
      phone: '600000000',
      mail: 'a@example.es',
    })
    expect(posts(client)[1]).not.toHaveProperty('mail')
  })
})
