import { parseFirstForm } from '../../../html/parsers/parseFirstForm'
import { accountPaymentUrl } from '../accountPaymentUrl'
import type { InitialAccountPaymentForm } from '../types/InitialAccountPaymentForm'
import { parseCertificateHolder } from './parseCertificateHolder'

/** Bind the starting form to the certificate holder and the validation step. */
export const parseInitialAccountPaymentForm = (
  html: string,
): InitialAccountPaymentForm => {
  const holder = parseCertificateHolder(html)
  const blank = parseFirstForm(html, accountPaymentUrl)
  if (
    !holder ||
    blank?.action !== accountPaymentUrl ||
    blank.fields['fAccion'] !== '1'
  )
    throw new Error(
      'AEAT: expected the initial payment form; no payment was sent',
    )
  return { holder, blank }
}
