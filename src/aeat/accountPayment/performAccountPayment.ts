import type { HtmlForm } from '../../html/types/HtmlForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchPaymentReceipt } from '../payments/fetchers/fetchPaymentReceipt'
import { writePaymentReceipt } from '../payments/writePaymentReceipt'
import { submitAccountPayment } from './submitAccountPayment'
import type { AccountPaymentReceipt } from './types/AccountPaymentReceipt'
import type { AccountPaymentRequest } from './types/AccountPaymentRequest'

/**
 * Press "Firmar y Enviar" and save the receipt. Once the NRC is known the
 * debt is paid, so a failed PDF download returns the receipt without it
 * rather than losing the NRC; `aeat pagos --out` fetches the PDF later.
 */
export const performAccountPayment = async (
  client: HttpClient,
  request: AccountPaymentRequest,
  summary: HtmlForm,
): Promise<AccountPaymentReceipt> => {
  const nrc = await submitAccountPayment(client, summary, request.justificante)
  const receipt = {
    modelo: request.modelo,
    justificante: request.justificante,
    importe: request.importe,
    nrc,
  }
  if (!request.outDir) return receipt
  try {
    const pdf = await fetchPaymentReceipt(client, nrc)
    return {
      ...receipt,
      pdfPath: await writePaymentReceipt(request.outDir, nrc, pdf),
    }
  } catch {
    return receipt
  }
}
