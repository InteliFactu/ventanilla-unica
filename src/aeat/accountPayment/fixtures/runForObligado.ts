import { payByAccountDebit } from '../payByAccountDebit'
import type { AccountPaymentPages } from './AccountPaymentPages'
import { accountPaymentFixture } from './accountPaymentFixture'
import { accountPaymentOtherNifSummaryHtml } from './accountPaymentOtherNifSummaryHtml'
import { accountPaymentPortal } from './accountPaymentPortal'
import { accountPaymentRequest } from './accountPaymentRequest'
import { accountPaymentSuccessHtml } from './accountPaymentSuccessHtml'

/** Exercise a third-party debit with separately observable payer and taxpayer sessions. */
export const runForObligado = (obligadoPages: AccountPaymentPages) => {
  const payer = accountPaymentPortal({
    step1: accountPaymentOtherNifSummaryHtml,
    final: accountPaymentSuccessHtml,
  })
  const obligado = accountPaymentPortal({
    certificateNif: accountPaymentFixture.otherNif,
    ...obligadoPages,
  })
  const pending = payByAccountDebit(
    { request: payer, cookie: () => undefined },
    {
      ...accountPaymentRequest,
      nif: accountPaymentFixture.otherNif,
      confirm: true,
    },
    { request: obligado, cookie: () => undefined },
  )
  return { pending, payer, obligado }
}
