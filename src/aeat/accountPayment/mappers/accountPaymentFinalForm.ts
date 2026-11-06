import type { HtmlForm } from '../../../html/types/HtmlForm'
import { omitFields } from './omitFields'

/**
 * The "Firmar y Enviar" submit of the summary page (fAccion=4). Its onclick
 * (jsSendDisabled) disables the Conforme box and the CONF and CANCEL buttons
 * before submitting, so only the hidden fields travel. No XAdES signature is
 * made: the client certificate of the TLS session is the signature.
 */
export const accountPaymentFinalForm = (summary: HtmlForm): HtmlForm => ({
  action: summary.action,
  fields: omitFields(summary.fields, ['conforme', 'CONF', 'CANCEL']),
})
