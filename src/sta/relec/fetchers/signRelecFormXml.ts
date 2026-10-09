import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../../http/types/HttpClient'
import { signXml } from '../../../signing/xades/signXml'
import type { RelecSignPage } from '../types/RelecSignPage'
import { relecAppletHeaders } from './relecAppletHeaders'

/**
 * "Firmar y enviar" without AutoFirma: download the registry form XML from
 * `FileUploaderApplet` (`bajarArchivo` from position -1; the page's own
 * script signs only the first block, which is the whole file, so later
 * blocks are not fetched), sign it as XAdES-BES enveloped and upload the
 * base64 signature (`subirArchivo`) to the id the page names. The sede asks
 * for SHA1withRSA; the 2026-10-02 filing it accepted was signed SHA-256.
 */
export const signRelecFormXml = async (
  client: HttpClient,
  origin: string,
  page: RelecSignPage,
  identity: CertificateIdentity,
): Promise<string> => {
  const url = `${origin}/sta/FileUploaderApplet`
  const download = await client.request(url, {
    method: 'POST',
    body: '',
    headers: relecAppletHeaders({
      callOpAction: 'bajarArchivo',
      bajarArchivoID: page.inFileId,
      bajarArchivoNombre: page.fileName,
      bajarArchivoPos: '-1',
      bajarArchivoBorrar: 'false',
    }),
    timeoutMs: 180_000,
  })
  const xml = Buffer.from(download.text.trim(), 'base64')
  if (
    download.status !== 200 ||
    !xml.subarray(0, 120).toString().includes('<REGIS>')
  )
    throw new Error(
      `FileUploaderApplet did not return the registry form (${String(download.status)})`,
    )
  const signed = signXml(identity, xml, {
    mode: 'enveloped',
    keyInfo: { chain: false, reference: false },
  })
  const upload = await client.request(url, {
    method: 'POST',
    body: signed.xml.toString('base64'),
    headers: relecAppletHeaders({
      callOpAction: 'subirArchivo',
      subirArchivoNombre: page.fileName,
      subirArchivoID: page.outFileId,
    }),
    timeoutMs: 180_000,
  })
  if (upload.status !== 200)
    throw new Error(
      `FileUploaderApplet subirArchivo answered ${String(upload.status)}: ${upload.text.slice(0, 200)}`,
    )
  return signed.signer
}
