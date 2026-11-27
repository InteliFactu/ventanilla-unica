import type { AccountPaymentRequest } from '../types/AccountPaymentRequest'
import { accountPaymentFixture as fx } from './accountPaymentFixture'

/** The unconfirmed request for the fixture payment, by the certificate holder. */
export const accountPaymentRequest: AccountPaymentRequest = {
  nif: fx.nif,
  modelo: fx.modelo,
  justificante: fx.justificante,
  importe: fx.importe,
  iban: fx.iban,
  confirm: false,
}
