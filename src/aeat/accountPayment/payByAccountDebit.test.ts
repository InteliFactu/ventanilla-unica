import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import { accountPaymentErrorHtml } from './fixtures/accountPaymentErrorHtml'
import { accountPaymentFixture as fx } from './fixtures/accountPaymentFixture'
import { accountPaymentFormHtml } from './fixtures/accountPaymentFormHtml'
import { accountPaymentSuccessHtml } from './fixtures/accountPaymentSuccessHtml'
import { accountPaymentSummaryHtml } from './fixtures/accountPaymentSummaryHtml'
import { collaboratingEntitiesHtml } from './fixtures/collaboratingEntitiesHtml'
import { payByAccountDebit } from './payByAccountDebit'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'

type Pages = {
  readonly step1?: string
  readonly final?: string | Error
  readonly payments?: string
  readonly pdf?: string
}

const isFinalStep = (options: HttpRequestOptions | undefined): boolean =>
  String(options?.body ?? '').includes('fAccion=4')

const answer = (text: string): Awaited<ReturnType<HttpClient['request']>> => ({
  status: 200,
  url: '',
  headers: {},
  body: Buffer.from(text),
  text,
})

const pageFor = (url: string, pages: Pages): string => {
  const routes: readonly (readonly [string, string])[] = [
    ['VerEntidadesAdheridas', collaboratingEntitiesHtml],
    ['MisPagos', pages.payments ?? ''],
    ['ImpresionPDF', pages.pdf ?? '%PDF-1.4'],
    ['LiquidacionesCuenta', accountPaymentFormHtml],
  ]
  return routes.find(([fragment]) => url.includes(fragment))?.[1] ?? 'session'
}

const finalAnswer = async (
  final: string | Error | undefined,
): Promise<Awaited<ReturnType<HttpClient['request']>>> => {
  if (final instanceof Error) throw final
  return Promise.resolve(answer(final ?? ''))
}

const portal = (pages: Pages) =>
  vi.fn<HttpClient['request']>(async (url, options) => {
    if (isFinalStep(options)) return finalAnswer(pages.final)
    return Promise.resolve(
      answer(
        options?.method === 'POST'
          ? (pages.step1 ?? accountPaymentSummaryHtml)
          : pageFor(url, pages),
      ),
    )
  })

const request: AccountPaymentRequest = {
  nif: fx.nif,
  modelo: fx.modelo,
  justificante: fx.justificante,
  importe: fx.importe,
  iban: fx.iban,
  confirm: false,
}

const run = async (
  pages: Pages,
  patch: Partial<AccountPaymentRequest> = {},
) => {
  const request_ = portal(pages)
  const result = await payByAccountDebit(
    { request: request_, cookie: () => undefined },
    { ...request, ...patch },
  )
  return {
    result,
    finalPosts: request_.mock.calls.filter(([, o]) => isFinalStep(o)).length,
  }
}

describe('payByAccountDebit', () => {
  it('plans up to the summary and never presses "Firmar y Enviar" without confirmation', async () => {
    const { result, finalPosts } = await run({
      final: accountPaymentSuccessHtml,
    })
    expect(result.executed).toBe(false)
    expect(result.notes).toEqual([])
    expect(result.titular).toBe(fx.nombre)
    expect(finalPosts).toBe(0)
  })

  it('does not press it when the first step answers errors, even confirmed', async () => {
    const { result, finalPosts } = await run(
      { step1: accountPaymentErrorHtml, final: accountPaymentSuccessHtml },
      { confirm: true },
    )
    expect(result.executed).toBe(false)
    expect(result.notes[0]).toMatch(/^AEAT: Número de Justificante/)
    expect(finalPosts).toBe(0)
  })

  it('does not pay a justificante MisPagos already lists', async () => {
    const payments = `<tr><td>010</td><td>x</td><td>${fx.justificante}</td><td>50,00</td><td>1583</td><td>06/11/2026</td><td><a href='ImpresionPDF?nrc=${fx.nrc}'>Descargar</a></td></tr>`
    const { result, finalPosts } = await run(
      { payments, final: accountPaymentSuccessHtml },
      { confirm: true },
    )
    expect(result.notes[0]).toMatch(/already lists NRC/)
    expect(finalPosts).toBe(0)
  })

  it('warns that MisPagos is not checked for another NIF', async () => {
    const { result } = await run({}, { nif: 'B00000000' })
    expect(result.notes.join(' ')).toMatch(/MisPagos was not checked/)
  })

  it('pays when confirmed, returns the NRC and saves the receipt', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-pagar-'))
    const { result, finalPosts } = await run(
      { final: accountPaymentSuccessHtml },
      { confirm: true, outDir },
    )
    expect(finalPosts).toBe(1)
    expect(result.executed).toBe(true)
    expect(result.receipt).toEqual({
      modelo: fx.modelo,
      justificante: fx.justificante,
      importe: fx.importe,
      nrc: fx.nrc,
      pdfPath: join(outDir, `aeat-pago-${fx.nrc}.pdf`),
    })
  })

  it('keeps the NRC when the receipt PDF fails', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-pagar-'))
    const { result } = await run(
      { final: accountPaymentSuccessHtml, pdf: '<html>' },
      { confirm: true, outDir },
    )
    expect(result.receipt?.nrc).toBe(fx.nrc)
    expect(result.receipt?.pdfPath).toBeUndefined()
    expect(result.notes.at(-1)).toMatch(/could not be downloaded/)
  })

  it('reports a refused payment as an error, never as success', async () => {
    const refused = accountPaymentErrorHtml.replace(
      /<h3>[\s\S]*<\/div>/,
      "<li><span class='raquo'></span>La entidad ha rechazado el cargo: saldo insuficiente.</li></div>",
    )
    await expect(run({ final: refused }, { confirm: true })).rejects.toThrow(
      'AEAT refused the payment: La entidad ha rechazado el cargo: saldo insuficiente.',
    )
  })

  it('says the outcome is unknown when the final answer is empty or lost', async () => {
    await expect(run({ final: '<p>?</p>' }, { confirm: true })).rejects.toThrow(
      /no NRC and no error; the payment may have been made/,
    )
    await expect(
      run({ final: new Error('timeout') }, { confirm: true }),
    ).rejects.toThrow(
      /got no answer \(Error: timeout\); the payment may have been made/,
    )
  })
})
