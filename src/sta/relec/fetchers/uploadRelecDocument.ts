import { readFile } from 'node:fs/promises'

import type { HttpClient } from '../../../http/types/HttpClient'
import { buildMultipartBody } from '../../registry/builders/buildMultipartBody'
import { mapHexText } from '../mappers/mapHexText'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/**
 * Upload one PDF into its row: `POST /sta/FileUploader?file=<hex name>&action=savefile`
 * with the popup's multipart form, asking for a signature in field
 * `Telematico`. The sede answers a script calling `parent.uploadEnd()`.
 */
export const uploadRelecDocument = async (
  client: HttpClient,
  target: RelecUploadTarget,
  session: string,
): Promise<void> => {
  const { origin, slot, document } = target
  const file = mapHexText(document.uploadName)
  // the path is the holder's own --documentos choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const bytes = await readFile(document.path)
  const { body, contentType } = buildMultipartBody(
    {
      tipoDocumento: String(slot),
      maxSize: '50000',
      file,
      urlBack:
        'https%3A%2F%2Fsede.caceres.es%2Fsta%2FCarpetaPublic%2FdoEvent%3FAPP_CODE%3DSTA%26PAGE_CODE%3DCATALOGO',
      noFirmar: '',
    },
    {
      field: 'fichero',
      name: document.uploadName,
      type: 'application/pdf',
      bytes,
    },
  )
  const response = await client.request(
    `${origin}/sta/FileUploader?file=${file}&action=savefile&sessionid=${session}&tipo=${String(slot)}&maxSize=50000&checkPdf=true&accionfirma=firma&signatureField=Telematico`,
    {
      method: 'POST',
      body,
      headers: { 'Content-Type': contentType },
      timeoutMs: 300_000,
    },
  )
  if (!response.text.includes('uploadEnd'))
    throw new Error(
      `FileUploader refused ${document.uploadName} (${String(response.status)}): ${response.text.slice(0, 200)}`,
    )
}
