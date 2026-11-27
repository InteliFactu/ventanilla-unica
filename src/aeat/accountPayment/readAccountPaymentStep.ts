import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import type { HtmlForm } from '../../html/types/HtmlForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { accountPaymentUrl } from './accountPaymentUrl'
import { postAccountPaymentForm } from './fetchers/postAccountPaymentForm'
import { parsePaymentAlerts } from './parsers/parsePaymentAlerts'
import type { AccountPaymentContext } from './types/AccountPaymentContext'

/** Submit the validation step and read the summary or the form errors. */
export const readAccountPaymentStep = async (
  client: HttpClient,
  form: HtmlForm,
): Promise<Pick<AccountPaymentContext, 'alerts' | 'summary'>> => {
  const step = await postAccountPaymentForm(client, form)
  const alerts = parsePaymentAlerts(step)
  return {
    alerts,
    summary:
      alerts.length > 0 ? undefined : parseFirstForm(step, accountPaymentUrl),
  }
}
