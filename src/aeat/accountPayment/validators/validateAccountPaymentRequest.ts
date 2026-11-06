import type { CliOptions } from '../../../cli/types/CliOptions'
import { validateNif } from '../../../tools/nif/validators/validateNif'
import { isConfirmed } from '../../../write/isConfirmed'
import { euroTextToCents } from '../../paymentLetter/mappers/euroTextToCents'
import { isEuroAmountText } from '../../paymentLetter/validators/isEuroAmountText'
import { normalizeIban } from '../mappers/normalizeIban'
import type { AccountPaymentRequest } from '../types/AccountPaymentRequest'
import { hasValidCccDigits } from './hasValidCccDigits'
import { isJustificanteText } from './isJustificanteText'
import { isPasarelaModelo } from './isPasarelaModelo'
import { isSpanishIban } from './isSpanishIban'

/** The `aeat pagar` options checked offline, before any request, as a typed request. */
export const validateAccountPaymentRequest = (
  options: CliOptions,
): AccountPaymentRequest => {
  const nif = validateNif(options['nif'] ?? '')
  const modelo = options['modelo'] ?? ''
  const justificante = (options['justificante'] ?? '').toUpperCase()
  const importe = options['importe'] ?? ''
  const iban = normalizeIban(options['iban'] ?? '')
  const checks: readonly (readonly [boolean, string])[] = [
    [nif.valido, '--nif must be a valid NIF, NIE or entity NIF'],
    [
      isPasarelaModelo(modelo),
      '--modelo must be 002, 004, 008, 010, 031, 032, 060, 061 or 069',
    ],
    [
      isJustificanteText(justificante),
      '--justificante must be the 13 characters of the document',
    ],
    [
      isEuroAmountText(importe) && euroTextToCents(importe) > 0,
      '--importe must be an amount above zero like 50,00 or 1.234,56',
    ],
    [
      isSpanishIban(iban),
      '--iban must be a Spanish IBAN with a valid checksum',
    ],
    [
      hasValidCccDigits(iban),
      '--iban carries wrong account control digits (positions 13-14)',
    ],
  ]
  const failed = checks.find(([valid]) => !valid)
  if (failed) throw new Error(failed[1])
  return {
    nif: nif.normalizado,
    modelo,
    justificante,
    importe,
    iban,
    nombre: options['nombre'],
    outDir: options['out'],
    confirm: isConfirmed(options),
  }
}
