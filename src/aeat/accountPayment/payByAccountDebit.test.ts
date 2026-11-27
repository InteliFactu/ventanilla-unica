import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import type { AccountPaymentPages } from './fixtures/AccountPaymentPages'
import { accountPaymentErrorHtml } from './fixtures/accountPaymentErrorHtml'
import { accountPaymentFixture as fx } from './fixtures/accountPaymentFixture'
import { accountPaymentFormHtml } from './fixtures/accountPaymentFormHtml'
import { accountPaymentOtherNifSummaryHtml } from './fixtures/accountPaymentOtherNifSummaryHtml'
import { accountPaymentPortal } from './fixtures/accountPaymentPortal'
import { accountPaymentRequest } from './fixtures/accountPaymentRequest'
import { accountPaymentSuccessHtml } from './fixtures/accountPaymentSuccessHtml'
import { countFinalAccountPaymentPosts } from './fixtures/countFinalAccountPaymentPosts'
import { misPagosHeaderHtml } from './fixtures/misPagosHeaderHtml'
import { misPagosPaidRowHtml } from './fixtures/misPagosPaidRowHtml'
import { payByAccountDebit } from './payByAccountDebit'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'

const run = async (
  pages: AccountPaymentPages,
  patch: Partial<AccountPaymentRequest> = {},
) => {
  const request_ = accountPaymentPortal(pages)
  const result = await payByAccountDebit(
    { request: request_, cookie: () => undefined },
    { ...accountPaymentRequest, ...patch },
  )
  return { result, finalPosts: countFinalAccountPaymentPosts(request_) }
}

describe('payByAccountDebit', () => {
  it('stops an unexpected starting form before any payment POST in plan mode', async () => {
    const payer = accountPaymentPortal({
      blank: accountPaymentFormHtml.replace("value='1'/>", "value='4'/>"),
      final: accountPaymentSuccessHtml,
    })
    await expect(
      payByAccountDebit(
        { request: payer, cookie: () => undefined },
        accountPaymentRequest,
      ),
    ).rejects.toThrow('expected the initial payment form')
    expect(
      payer.mock.calls.filter(([, options]) => options?.method === 'POST'),
    ).toHaveLength(0)
  })

  it('does not debit when the authenticated payer receives a generic error page', async () => {
    const payer = accountPaymentPortal({
      paymentsHtml: `${misPagosHeaderHtml}<p>Error interno</p>`,
      final: accountPaymentSuccessHtml,
    })
    await expect(
      payByAccountDebit(
        { request: payer, cookie: () => undefined },
        { ...accountPaymentRequest, confirm: true },
      ),
    ).rejects.toThrow('MisPagos printed no payment history page')
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

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
    const { result, finalPosts } = await run(
      { payments: misPagosPaidRowHtml, final: accountPaymentSuccessHtml },
      { confirm: true },
    )
    expect(result.notes[0]).toMatch(/already lists NRC/)
    expect(finalPosts).toBe(0)
  })

  it('warns that MisPagos is not checked for another NIF', async () => {
    const { result } = await run(
      { step1: accountPaymentOtherNifSummaryHtml },
      { nif: fx.otherNif },
    )
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
