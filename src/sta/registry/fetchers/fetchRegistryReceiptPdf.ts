import type { HttpClient } from '../../../http/types/HttpClient'

/**
 * The justificante PDF of a registry entry: `/sta/Utils/DocumentCheck` with
 * `ACTION=view`, the CSV and the filer's NIF, the link the SPA's success page
 * offers. Any non-PDF answer is an error.
 */
export const fetchRegistryReceiptPdf = async (
  client: HttpClient,
  origin: string,
  receipt: { readonly csv: string; readonly nif: string },
): Promise<Buffer> => {
  const response = await client.request(
    `${origin}/sta/Utils/DocumentCheck?ACTION=view&CUD=${encodeURIComponent(receipt.csv)}&NIF=${encodeURIComponent(receipt.nif)}`,
  )
  if (!response.body.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error(
      `DocumentCheck did not return a PDF for ${receipt.csv} (${String(response.status)})`,
    )
  return response.body
}
