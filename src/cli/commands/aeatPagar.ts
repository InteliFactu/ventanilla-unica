import { payByAccountDebit } from '../../aeat/accountPayment/payByAccountDebit'
import { validateAccountPaymentRequest } from '../../aeat/accountPayment/validators/validateAccountPaymentRequest'
import { loadObligadoClient } from '../loadObligadoClient'
import type { Command } from '../types/Command'

export const aeatPagar: Command = {
  portal: 'aeat',
  action: 'pagar',
  description:
    'Pay an AEAT liquidación (modelo 002, 004, 008, 010, 031, 032, 060, 061, 069) by debit to an account at a collaborating bank (--modelo, --justificante, --importe n,nn, --iban; --nombre for another NIF). Use --cert-obligado and --key-obligado to check MisPagos when the payer has a different NIF. Without --confirmar si it validates the payment with the AEAT up to its summary page and charges nothing; confirmed after checking MisPagos, it debits the account, returns the NRC and saves the receipt PDF with --out',
  options: [
    'nif',
    'modelo',
    'justificante',
    'importe',
    'iban',
    'nombre',
    'cert-obligado',
    'key-obligado',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const request = validateAccountPaymentRequest(options)
    return payByAccountDebit(
      client,
      request,
      await loadObligadoClient(options, request.nif),
    )
  },
}
