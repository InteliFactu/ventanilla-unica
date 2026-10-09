import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../../http/types/HttpClient'
import { signPdf } from '../../../signing/pades/signPdf'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/**
 * Sign an uploaded PDF the way the popup's AutoFirma call does, without
 * AutoFirma: `AutofirmaDownload10` returns the stored PDF in base64, it is
 * signed here as PAdES (ETSI.CAdES.detached, invisible; the sede asked
 * AutoFirma for field `Telematico`, and the invisible pyfirma signature of
 * the 2026-10-02 filing was accepted) and goes back through
 * `AutofirmaUpload10` with the same row and name.
 */
export const signRelecDocument = async (
  client: HttpClient,
  target: RelecUploadTarget,
  identity: CertificateIdentity,
): Promise<void> => {
  const { origin, slot, document } = target
  const query = `hash=null&dboidType=${String(slot)}&filename=${encodeURIComponent(document.uploadName)}`
  const headers = { 'Content-Type': 'text/plain' }
  const download = await client.request(
    `${origin}/sta/AutofirmaDownload10?${query}`,
    { method: 'POST', body: '', headers, timeoutMs: 300_000 },
  )
  const pdf = Buffer.from(download.text.trim(), 'base64')
  if (
    download.status !== 200 ||
    !pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))
  )
    throw new Error(
      `AutofirmaDownload10 did not return ${document.uploadName} (${String(download.status)})`,
    )
  const signed = signPdf(identity, pdf)
  const upload = await client.request(
    `${origin}/sta/AutofirmaUpload10?${query}`,
    {
      method: 'POST',
      body: signed.toString('base64'),
      headers,
      timeoutMs: 300_000,
    },
  )
  if (upload.status !== 200)
    throw new Error(
      `AutofirmaUpload10 answered ${String(upload.status)} for ${document.uploadName}`,
    )
}
