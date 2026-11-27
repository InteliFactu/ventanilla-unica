import { type Mock, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { AccountPaymentPages } from './AccountPaymentPages'
import { accountPaymentAnswer } from './accountPaymentAnswer'
import { accountPaymentFinalAnswer } from './accountPaymentFinalAnswer'
import { accountPaymentPortalPage } from './accountPaymentPortalPage'
import { accountPaymentSummaryHtml } from './accountPaymentSummaryHtml'
import { isFinalAccountPaymentStep } from './isFinalAccountPaymentStep'

/** A synthetic AEAT payment portal that records every request. */
export const accountPaymentPortal = (
  pages: AccountPaymentPages,
): Mock<HttpClient['request']> =>
  vi.fn<HttpClient['request']>(async (url, options) => {
    if (isFinalAccountPaymentStep(options))
      return accountPaymentFinalAnswer(pages.final)
    if (url.includes('MisPagos'))
      return Promise.resolve(
        accountPaymentAnswer(
          accountPaymentPortalPage(url, pages),
          pages.paymentsStatus,
        ),
      )
    return Promise.resolve(
      accountPaymentAnswer(
        options?.method === 'POST'
          ? (pages.step1 ?? accountPaymentSummaryHtml)
          : accountPaymentPortalPage(url, pages),
      ),
    )
  })
