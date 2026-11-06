import { payByAccountDebit } from '../../aeat/accountPayment/payByAccountDebit'
import { validateAccountPaymentRequest } from '../../aeat/accountPayment/validators/validateAccountPaymentRequest'
import type { Command } from '../types/Command'

export const aeatPagar: Command = {
  portal: 'aeat',
  action: 'pagar',
  description:
    'Pay an AEAT liquidación (modelo 002, 004, 008, 010, 031, 032, 060, 061, 069) by debit to an account at a collaborating bank (--modelo, --justificante, --importe n,nn, --iban; --nombre for another NIF). Without --confirmar si it validates the payment with the AEAT up to its summary page and charges nothing; confirmed, it debits the account, returns the NRC and saves the receipt PDF with --out',
  options: ['nif', 'modelo', 'justificante', 'importe', 'iban', 'nombre'],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    payByAccountDebit(client, validateAccountPaymentRequest(options)),
}
