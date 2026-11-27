import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { CertificateHolder } from './CertificateHolder'

export type InitialAccountPaymentForm = {
  readonly holder: CertificateHolder
  readonly blank: HtmlForm
}
