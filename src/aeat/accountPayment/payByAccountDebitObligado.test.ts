import { describe, expect, it } from 'vitest'

import { accountPaymentFixture as fx } from './fixtures/accountPaymentFixture'
import { accountPaymentOtherNifSummaryHtml } from './fixtures/accountPaymentOtherNifSummaryHtml'
import { accountPaymentPortal } from './fixtures/accountPaymentPortal'
import { accountPaymentRequest } from './fixtures/accountPaymentRequest'
import { accountPaymentSuccessHtml } from './fixtures/accountPaymentSuccessHtml'
import { countFinalAccountPaymentPosts } from './fixtures/countFinalAccountPaymentPosts'
import { misPagosHeaderHtml } from './fixtures/misPagosHeaderHtml'
import { misPagosHistoryHtml } from './fixtures/misPagosHistoryHtml'
import { misPagosPaidRowHtml } from './fixtures/misPagosPaidRowHtml'
import { runForObligado } from './fixtures/runForObligado'
import { payByAccountDebit } from './payByAccountDebit'

describe('payByAccountDebit with the obligado certificate', () => {
  it("reads MisPagos with the obligado's certificate when the payer is another NIF", async () => {
    const { pending, payer, obligado } = runForObligado({
      payments: misPagosPaidRowHtml,
    })
    const result = await pending
    expect(result.executed).toBe(false)
    expect(result.notes).toEqual([
      expect.stringMatching(/^MisPagos already lists NRC/),
    ])
    expect(
      payer.mock.calls.filter(([, options]) => options?.method === 'POST'),
    ).toHaveLength(0)
    expect(payer.mock.calls.some(([url]) => url.includes('MisPagos'))).toBe(
      false,
    )
    expect(obligado.mock.calls.map(([url]) => url)).toEqual([
      expect.stringContaining('MdcAcceso'),
      expect.stringContaining('LiquidacionesCuenta'),
      expect.stringContaining('MisPagos'),
    ])
    expect(
      obligado.mock.calls.every(([, options]) => options?.method !== 'POST'),
    ).toBe(true)
  })

  it("pays when confirmed and the obligado's MisPagos does not list it", async () => {
    const { pending, payer } = runForObligado({})
    const result = await pending
    expect(result.notes).toEqual([])
    expect(result.executed).toBe(true)
    expect(result.receipt?.nrc).toBe(fx.nrc)
    expect(countFinalAccountPaymentPosts(payer)).toBe(1)
  })

  it('accepts the abbreviated history table with an existing autoliquidación', async () => {
    const row =
      '<tr><td>Autoliquid.</td><td>130/2025/1T</td><td>-</td><td>3,00 €</td><td>1583</td><td>06/11/2026</td><td><a href="ImpresionPDF?nrc=130000000002BXYZ123456">Descargar</a></td></tr>'
    const { pending, payer } = runForObligado({
      paymentsHtml: misPagosHistoryHtml(row).replace(
        '<th>Justificante</th>',
        '<th></th>',
      ),
    })
    expect((await pending).executed).toBe(true)
    expect(countFinalAccountPaymentPosts(payer)).toBe(1)
  })

  it.each([
    [500, 'AEAT: MisPagos answered HTTP 500'],
    [200, 'AEAT: MisPagos printed no payment history page'],
  ])(
    'never pays when MisPagos answers %i without a history',
    async (paymentsStatus, error) => {
      const { pending, payer } = runForObligado({
        paymentsStatus,
        paymentsHtml: `${misPagosHeaderHtml}<p>Se ha producido un error</p>`,
      })
      await expect(pending).rejects.toThrow(error)
      expect(
        payer.mock.calls.filter(([, options]) => options?.method === 'POST'),
      ).toHaveLength(0)
    },
  )

  it('refuses a second session whose certificate holder does not match the obligado', async () => {
    const { pending, payer, obligado } = runForObligado({
      certificateNif: fx.nif,
    })
    await expect(pending).rejects.toThrow('does not match the obligado')
    expect(
      payer.mock.calls.filter(([, options]) => options?.method === 'POST'),
    ).toHaveLength(0)
    expect(obligado.mock.calls.some(([url]) => url.includes('MisPagos'))).toBe(
      false,
    )
  })

  it('keeps a third-party debit blocked without the second certificate', async () => {
    const payer = accountPaymentPortal({
      step1: accountPaymentOtherNifSummaryHtml,
      final: accountPaymentSuccessHtml,
    })
    const result = await payByAccountDebit(
      { request: payer, cookie: () => undefined },
      { ...accountPaymentRequest, nif: fx.otherNif, confirm: true },
    )
    expect(result.executed).toBe(false)
    expect(result.notes).toEqual([
      expect.stringMatching(/MisPagos was not checked/),
    ])
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('refuses a payment history without evidence that its rows were loaded', async () => {
    const { pending, payer } = runForObligado({
      paymentsHtml: misPagosHistoryHtml(''),
    })
    await expect(pending).rejects.toThrow(
      'MisPagos did not establish whether the payment already exists',
    )
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('blocks a matching payment row without an NRC link', async () => {
    const { pending, payer } = runForObligado({
      payments: misPagosPaidRowHtml.replace(/<a.*?<\/a>/, 'Transferencia'),
    })
    await expect(pending).rejects.toThrow('MisPagos lists justificante')
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('keeps the first receipt when MisPagos omits the header row opening tag', async () => {
    const { pending, payer } = runForObligado({
      paymentsHtml: misPagosHistoryHtml(misPagosPaidRowHtml).replace(
        '<thead><tr>',
        '<thead>',
      ),
    })
    expect((await pending).notes).toEqual([
      expect.stringMatching(/^MisPagos already lists NRC/),
    ])
    expect(
      payer.mock.calls.filter(([, options]) => options?.method === 'POST'),
    ).toHaveLength(0)
  })

  it('recognizes a verified Predeclaración row in the same history as a paid liquidation', async () => {
    const paymentsHtml = misPagosHistoryHtml()
      .replace('Liquidación</td><td>010', 'Predeclaración</td><td>303')
      .replace('</tbody>', `${misPagosPaidRowHtml}</tbody>`)
    const { pending, payer } = runForObligado({ paymentsHtml })
    expect((await pending).notes).toEqual([
      expect.stringMatching(/^MisPagos already lists NRC/),
    ])
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('does not discard the trailing paid row when its closing tag is absent', async () => {
    const { pending, payer } = runForObligado({
      paymentsHtml: misPagosHistoryHtml().replace(
        '</tbody>',
        `${misPagosPaidRowHtml.replace('</tr>', '')}</tbody>`,
      ),
    })
    await expect(pending).rejects.toThrow(
      'MisPagos history has incomplete table markup',
    )
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('reads a trailing payment when the row close has trailing whitespace', async () => {
    const { pending, payer } = runForObligado({
      paymentsHtml: misPagosHistoryHtml().replace(
        '</tbody>',
        `${misPagosPaidRowHtml.replace('</tr>', '</tr >')}</tbody>`,
      ),
    })
    expect((await pending).notes).toEqual([
      expect.stringMatching(/^MisPagos already lists NRC/),
    ])
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('refuses a placeholder row with a reference and otherwise empty cells', async () => {
    const { pending, payer } = runForObligado({
      payments:
        '<tr><td></td><td></td><td>010000000002B</td><td></td><td></td><td></td><td></td></tr>',
    })
    await expect(pending).rejects.toThrow(
      'MisPagos did not establish whether the payment already exists',
    )
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('refuses histories with two matching tables rather than trusting the first', async () => {
    const { pending, payer } = runForObligado({
      paymentsHtml: `${misPagosHistoryHtml()}${misPagosHistoryHtml(misPagosPaidRowHtml)}`,
    })
    await expect(pending).rejects.toThrow(
      'MisPagos history has multiple matching tables',
    )
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })

  it('refuses a generic page whose only matching table is in a comment', async () => {
    const { pending, payer } = runForObligado({
      paymentsHtml: `${misPagosHeaderHtml}<!-- ${misPagosHistoryHtml()} -->`,
    })
    await expect(pending).rejects.toThrow(
      'MisPagos printed no payment history page',
    )
    expect(countFinalAccountPaymentPosts(payer)).toBe(0)
  })
})
