import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { sweepAeatDebts } from './sweepAeatDebts'

const page = (text: string): HttpResponse => ({
  status: 200,
  url: 'https://www1.agenciatributaria.gob.es/x',
  headers: {},
  body: Buffer.alloc(0),
  text,
})

const consultaHtml = `
<li><strong>NIF:</strong> 12345678Z</li>
<li><strong>Nombre:</strong> JANE DOE</li>
<table>
<tr><th>Clave de liquidación</th><th>Objeto tributario</th><th>Importe pendiente</th><th>Importe a ingresar</th><th>Periodo</th><th>Situación</th></tr>
<tr><td>A1060012340012345</td><td>0A 2024 100 TT-IRPF EJER:2024 PER:ANUAL</td><td>639,26</td><td></td><td>Voluntario</td><td>Pendiente de pago en plazo de pago voluntario</td></tr>
</table>
`

const consultaNoDebtsHtml = `
<li><strong>NIF:</strong> B12345678</li>
<li><strong>Nombre:</strong> ACME SL</li>
Avisos No existen deudas para mostrar Agencia Tributaria
`

const detalleHtml = `
<h2>Datos generales</h2>
<p>Fecha de liquidación: 03-05-2025</p>
<p>Importe de la deuda: 639,26</p>
<p>Total a ingresar: 639,26</p>
`

const sinAgreementsHtml = ''

const buildClient = (
  responses: Readonly<
    Record<string, (options: HttpRequestOptions | undefined) => HttpResponse>
  >,
): HttpClient => {
  const request = vi.fn<HttpClient['request']>(
    async (url, options): Promise<HttpResponse> => {
      const respond = responses[url]
      if (!respond) throw new Error(`unexpected request: ${url}`)
      return Promise.resolve(respond(options))
    },
  )
  return { request, cookie: () => undefined }
}

describe('sweepAeatDebts', () => {
  it('opens the session, reads debts with their detail, and reads agreements', async () => {
    const client = buildClient({
      'https://www1.agenciatributaria.gob.es/wlpl/BUGC-JDIT/MdcAcceso': () =>
        page(''),
      'https://www1.agenciatributaria.gob.es/wlpl/SRVO-JDIT/ConsultaDdas': () =>
        page(consultaHtml),
      'https://www1.agenciatributaria.gob.es/wlpl/SRVO-JDIT/DetalleDda': () =>
        page(detalleHtml),
      'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.solicitud.SolAccionW?fAccion=petic&fFigura=obli':
        () => page(sinAgreementsHtml),
    })
    const report = await sweepAeatDebts(client, '12345678Z')
    expect(report.nif).toBe('12345678Z')
    expect(report.entity).toBe('JANE DOE')
    expect(report.debts).toHaveLength(1)
    expect(report.debts[0]).toMatchObject({
      clave: 'A1060012340012345',
      ejercicio: '2024',
      modelo: '100',
      estado: 'voluntaria',
      detail: { fechaLiquidacion: '03-05-2025' },
    })
    expect(report.agreements).toEqual([])
    expect(report.totals).toEqual({ pendiente: 639.26, aIngresar: 0 })
    expect(report.hint).toBeUndefined()
  })

  it('reports a hint and no debts when ConsultaDdas answers with none', async () => {
    const client = buildClient({
      'https://www1.agenciatributaria.gob.es/wlpl/BUGC-JDIT/MdcAcceso': () =>
        page(''),
      'https://www1.agenciatributaria.gob.es/wlpl/SRVO-JDIT/ConsultaDdas': () =>
        page(consultaNoDebtsHtml),
      'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.solicitud.SolAccionW?fAccion=petic&fFigura=obli':
        () => page(sinAgreementsHtml),
    })
    const report = await sweepAeatDebts(client, 'B12345678')
    expect(report.entity).toBe('ACME SL')
    expect(report.debts).toEqual([])
    expect(report.totals).toEqual({ pendiente: 0, aIngresar: 0 })
    expect(report.hint).toBe('No existen deudas para mostrar')
  })

  it('refuses a page that is neither a debt list nor the no-debts notice', async () => {
    const request = vi.fn<HttpClient['request']>().mockResolvedValue({
      status: 200,
      url: 'https://www1.agenciatributaria.gob.es/wlpl/SRVO-JDIT/ConsultaDdas',
      headers: {},
      body: Buffer.alloc(0),
      text: '<html><body><p>Acceso no autorizado</p></body></html>',
    })
    const client: HttpClient = { request, cookie: () => undefined }
    await expect(sweepAeatDebts(client, 'B12345678')).rejects.toThrow(
      'unexpected page instead of the debt list',
    )
  })

  it('refuses an identification form that has a holder and unrelated notices', async () => {
    const request = vi.fn<HttpClient['request']>().mockResolvedValue(
      page(`
        <p>Titular del certificado NIF: 00000000T Nombre: EXAMPLE PERSON</p>
        <form><input name="fnif"><input name="ACEPTAR"></form>
        <h2>Avisos</h2><p>Error en la consulta</p>
        <footer>Agencia Tributaria</footer>
      `),
    )
    await expect(
      sweepAeatDebts({ request, cookie: () => undefined }, '00000000T'),
    ).rejects.toThrow('unexpected page instead of the debt list')
  })

  it('skips the SRAF agreements when told to, saying why', async () => {
    const client = buildClient({
      'https://www1.agenciatributaria.gob.es/wlpl/BUGC-JDIT/MdcAcceso': () =>
        page(''),
      'https://www1.agenciatributaria.gob.es/wlpl/SRVO-JDIT/ConsultaDdas': () =>
        page(consultaNoDebtsHtml),
    })
    const report = await sweepAeatDebts(client, 'B12345678', false)
    expect(report.agreements).toEqual([])
    expect(report.agreementsNote).toMatch(/only the certificate holder/)
  })
})
