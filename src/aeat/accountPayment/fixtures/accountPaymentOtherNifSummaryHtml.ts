import { accountPaymentFixture } from './accountPaymentFixture'
import { accountPaymentSummaryHtml } from './accountPaymentSummaryHtml'

/** The summary page for an obligado who is not the certificate holder. */
export const accountPaymentOtherNifSummaryHtml =
  accountPaymentSummaryHtml.replaceAll(
    accountPaymentFixture.nif,
    accountPaymentFixture.otherNif,
  )
