import type { HtmlForm } from '../../../html/types/HtmlForm'
import { encodeLatin1Form } from '../../../http/encodeLatin1Form'
import type { HttpClient } from '../../../http/types/HttpClient'

/**
 * POST one LiquidacionesCuenta step. The page is ISO-8859-15, so the body is
 * encoded as its browser would send it (a name with Ñ must arrive as 0xD1).
 */
export const postAccountPaymentForm = async (
  client: HttpClient,
  form: HtmlForm,
): Promise<string> => {
  const response = await client.request(form.action, {
    method: 'POST',
    body: encodeLatin1Form(form.fields),
    referer: form.action,
    defaultCharset: 'iso-8859-15',
  })
  if (response.status !== 200)
    throw new Error(
      `AEAT: LiquidacionesCuenta step answered HTTP ${String(response.status)}`,
    )
  return response.text
}
