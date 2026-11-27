import type { HttpResponse } from '../../../http/types/HttpResponse'
import { accountPaymentAnswer } from './accountPaymentAnswer'

/** The synthetic answer to "Firmar y Enviar": a page, or a lost connection. */
export const accountPaymentFinalAnswer = async (
  final: string | Error | undefined,
): Promise<HttpResponse> => {
  if (final instanceof Error) throw final
  return Promise.resolve(accountPaymentAnswer(final ?? ''))
}
