import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { AccountPaymentRequest } from '../types/AccountPaymentRequest'

/** Every summary field that does not echo the request: a reason never to press "Firmar y Enviar". */
export const summaryMismatches = (
  summary: HtmlForm,
  request: AccountPaymentRequest,
): readonly string[] => {
  const expected: Readonly<Record<string, string>> = {
    fAccion: '4',
    idmod: request.modelo,
    idjus: request.justificante,
    idnif: request.nif,
    idimp: request.importe,
    idiban: request.iban,
  }
  return Object.entries(expected)
    .filter(([name, value]) => summary.fields[name] !== value)
    .map(
      ([name, value]) =>
        `The summary page carries ${name}=${summary.fields[name] ?? '(missing)'} instead of ${value}.`,
    )
}
