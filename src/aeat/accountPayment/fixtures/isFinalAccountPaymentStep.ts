import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'

/** Whether a request is the final "Firmar y Enviar" POST, the one that debits the account. */
export const isFinalAccountPaymentStep = (
  options: HttpRequestOptions | undefined,
): boolean => String(options?.body ?? '').includes('fAccion=4')
