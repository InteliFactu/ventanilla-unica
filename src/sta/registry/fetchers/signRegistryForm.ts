import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../../http/types/HttpClient'
import { signXml } from '../../../signing/xades/signXml'
import type { RegistrySession } from '../types/RegistrySession'
import { registryHeaders } from './registryHeaders'

/**
 * Sign the registry form the way `/sta/reg/autofirma.js` does through
 * AutoFirma, without it: after a `sign` save, `AutofirmaDownload` with
 * `hash=firmar&dboidType=<procedure>&filename=xsig` returns the `<REGIS>`
 * XML in base64; it is signed as XAdES-BES and the base64 signature goes
 * back through `AutofirmaUpload` with the same hash and type. AutoFirma's
 * own format there is plain "XAdES"; enveloped is what the same T-Systems
 * platform accepted at the Cáceres sede.
 */
export const signRegistryForm = async (
  client: HttpClient,
  session: RegistrySession,
  identity: CertificateIdentity,
): Promise<string> => {
  const { origin, procedureId } = session
  const query = `hash=firmar&dboidType=${procedureId}`
  const headers = {
    ...registryHeaders(client, origin),
    'Content-Type': 'text/plain',
  }
  const form = await client.request(
    `${origin}/sta/AutofirmaDownload?${query}&filename=xsig`,
    { method: 'POST', body: '', headers, timeoutMs: 180_000 },
  )
  const xml = Buffer.from(form.text.trim(), 'base64')
  if (
    form.status !== 200 ||
    !xml.subarray(0, 64).toString().includes('<REGIS>')
  )
    throw new Error(
      `AutofirmaDownload did not return the registry form (${String(form.status)})`,
    )
  const signed = signXml(identity, xml, { mode: 'enveloped' })
  const upload = await client.request(
    `${origin}/sta/AutofirmaUpload?${query}`,
    {
      method: 'POST',
      body: signed.xml.toString('base64'),
      headers,
      timeoutMs: 180_000,
    },
  )
  if (upload.status !== 200)
    throw new Error(
      `AutofirmaUpload answered ${String(upload.status)}: ${upload.text.slice(0, 200)}`,
    )
  return signed.signer
}
