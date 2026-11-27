import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { generatePaymentLetter } from './generatePaymentLetter'

const clave = 'A0000000000000001'
const token = (value: string): string => `jQuery('#pUV').val('${value}');`

const portal = (
  finalPage: string,
  unread = '<strong>No se han obtenido resultados para estos datos</strong>',
) =>
  vi.fn<HttpClient['request']>(async (url) => {
    const pages: Readonly<Record<string, string>> = {
      ConsultaDdas: `<tr><td>${clave}</td><td>IRPF</td><td>2025</td><td>1.000,00</td></tr>${token('D0')}`,
      SvInteresadosQuery: unread,
      PagarParcial: `${clave}${token('A1')}`,
      DetalleDda: token('B2'),
      ResumenDdas: token('C3'),
      FinalPago: finalPage,
    }
    const name = /\/(\w+)(?:\?|$)/.exec(url)?.[1] ?? ''
    const text = pages[name] ?? ''
    return Promise.resolve({
      status: 200,
      url,
      headers: {},
      body: Buffer.from(text),
      text,
    })
  })

const request = { nif: '00000000T', clave, importe: '100,00', confirm: false }
const today = new Date(2026, 8, 26)
const final = '<h3>Documento de ingreso</h3><td>100000000000A</td>'

describe('generatePaymentLetter', () => {
  it('plans without touching the payment chain', async () => {
    const client = portal(final)
    const result = await generatePaymentLetter(
      { request: client, cookie: () => undefined },
      request,
      today,
    )
    expect(result.executed).toBe(false)
    expect(result.debt?.clave).toBe(clave)
    expect(result.notes).toEqual([])
    const urls = client.mock.calls.map(([url]) => url).join(' ')
    expect(urls).not.toMatch(/PagarParcial|FinalPago/)
  })

  it('does not run when an unread notification blocks it', async () => {
    const unread =
      "<tr id='filaNum0'><td><a href='DetalleSede?ncc=123456'>1</a></td><td>No</td></tr>"
    const result = await generatePaymentLetter(
      { request: portal(final, unread), cookie: () => undefined },
      { ...request, confirm: true },
      today,
    )
    expect(result.executed).toBe(false)
    expect(result.notes[0]).toMatch(/comparecer/)
  })

  it('stops before the payment chain on an unrecognized notification response', async () => {
    const client = portal(final, '<main>Error de identificaci&oacute;n</main>')
    await expect(
      generatePaymentLetter(
        { request: client, cookie: () => undefined },
        { ...request, confirm: true },
        today,
      ),
    ).rejects.toThrow('unrecognized notification list')
    expect(client.mock.calls.map(([url]) => url).join(' ')).not.toMatch(
      /PagarParcial|FinalPago/,
    )
  })

  it('generates when confirmed and notes a missing PDF reference', async () => {
    const result = await generatePaymentLetter(
      { request: portal(final), cookie: () => undefined },
      { ...request, confirm: true, outDir: '/nonexistent-never-written' },
      today,
    )
    expect(result.executed).toBe(true)
    expect(result.receipt?.justificante).toBe('100000000000A')
    expect(result.notes.at(-1)).toMatch(/no PDF reference/)
  })

  it('defaults today to now and adds no note without --out', async () => {
    const result = await generatePaymentLetter(
      { request: portal(final), cookie: () => undefined },
      { ...request, confirm: true },
    )
    expect(result.notes).toEqual([])
  })
})
