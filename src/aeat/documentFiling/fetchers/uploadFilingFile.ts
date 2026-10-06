import { randomUUID } from 'node:crypto'

import type { HttpClient } from '../../../http/types/HttpClient'
import { buildMultipartBody } from '../../../sta/registry/builders/buildMultipartBody'
import { documentFilingUrls } from '../documentFilingUrls'
import { parseUploadAnswer } from '../parsers/parseUploadAnswer'
import type { FilingDocument } from '../types/FilingDocument'
import type { UploadedFile } from '../types/UploadedFile'

/**
 * Store one file as the upload dialog's Fine Uploader does for a file under
 * its 2 MiB chunk size: one multipart request with `coleccion=EECAFICH`,
 * without which `UploadSv` answers 500. Larger files go in the same single
 * request, which the dialog would have chunked; that path is unverified.
 * Storing a file files nothing.
 */
export const uploadFilingFile = async (
  client: HttpClient,
  document: FilingDocument,
): Promise<UploadedFile> => {
  const { body, contentType } = buildMultipartBody(
    {
      coleccion: 'EECAFICH',
      qquuid: randomUUID(),
      qqfilename: document.name,
      qqtotalfilesize: String(document.content.length),
    },
    {
      field: 'qqfile',
      name: document.name,
      type: 'application/pdf',
      bytes: document.content,
    },
  )
  const response = await client.request(documentFilingUrls.upload, {
    method: 'POST',
    body,
    referer: documentFilingUrls.uploadDialog,
    headers: { 'Content-Type': contentType },
    timeoutMs: 600_000,
  })
  return parseUploadAnswer(response.text)
}
