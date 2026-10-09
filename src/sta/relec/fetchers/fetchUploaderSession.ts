import type { HttpClient } from '../../../http/types/HttpClient'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/**
 * Open the uploader popup of one document row
 * (`pages/relec/documentSignSend.jsp`), as "Adjuntar y firmar" does, and
 * read the `sessionid` its upload form posts with (the JSESSIONID).
 */
export const fetchUploaderSession = async (
  client: HttpClient,
  target: RelecUploadTarget,
): Promise<string> => {
  const { origin, type, person, slot } = target
  const query = `tipoDocumento=${type.dboid}&firma=S&extensions=${type.extensions}&personDBOID=${person}&maxSize=${type.maxSize}&checkPdf=N&reusable=${type.reusable}&allowMultiple=undefined&indice=${String(slot)}`
  const popup = await client.request(
    `${origin}/sta/pages/relec/documentSignSend.jsp?${query}`,
    { defaultCharset: 'iso-8859-1' },
  )
  const session = /id="sessionid" value="([\dA-F]+)"/i.exec(popup.text)?.[1]
  if (session === undefined)
    throw new Error(
      `the uploader popup of document ${String(slot + 1)} carried no session id`,
    )
  return session
}
