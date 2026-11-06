import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { AccountPaymentRequest } from '../types/AccountPaymentRequest'
import { omitFields } from './omitFields'

/**
 * The first step ("Aceptar datos y Continuar", fAccion=1) as the browser
 * submits it: the blank form's hidden fields with the request filled in. The
 * unchecked checkIban and idAPO boxes and the CONF button are not sent. This
 * step only validates; it answers the summary page or the errors.
 */
export const accountPaymentFirstForm = (
  blank: HtmlForm,
  request: AccountPaymentRequest,
  nombre: string,
): HtmlForm => ({
  action: blank.action,
  fields: {
    ...omitFields(blank.fields, ['checkIban', 'idAPO', 'CONF']),
    idmod: request.modelo,
    idjus: request.justificante,
    idnif: request.nif,
    idape: nombre,
    idimp: request.importe,
    idiban: request.iban,
  },
})
