import { unescapeZkLabel } from '../../filings/mappers/unescapeZkLabel'
import type { PresentationCheck } from '../types/PresentationCheck'
import { parseZkWidgetValue } from './parseZkWidgetValue'

/**
 * The payment window ("Formalizar Ingreso/Devolución": `ImporteResultado`,
 * `formasDePago`) and the "Diálogo Firma" window, whose two `notraducir`
 * labels are the signer and the declarant, and whose `dlgfir_decla` label is
 * the text being signed.
 */
export const parsePresentationCheck = (
  paymentAnswer: string,
  dialogAnswer: string,
): PresentationCheck => {
  const parties = [
    ...dialogAnswer.matchAll(
      /sclass:'colorAzulCorp notraducir'[^}]*?value:'((?:[^'\\]|\\.)*)'/g,
    ),
  ].map((match) => unescapeZkLabel(match[1] ?? ''))
  const signed = /sclass:'dlgfir_decla'[^}]*?value:'((?:[^'\\]|\\.)*)'/.exec(
    dialogAnswer,
  )?.[1]
  return {
    resultado: parseZkWidgetValue(paymentAnswer, 'ImporteResultado') ?? '',
    formaDePago: parseZkWidgetValue(paymentAnswer, 'formasDePago') ?? '',
    signer: parties[0] ?? '',
    onBehalfOf: parties[1] ?? parties[0] ?? '',
    signedText: unescapeZkLabel(signed ?? ''),
  }
}
