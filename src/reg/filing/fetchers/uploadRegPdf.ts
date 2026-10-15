import type { HttpClient } from '../../../http/types/HttpClient'
import { buildMultipartBody } from '../../../sta/registry/builders/buildMultipartBody'
import { callRegApi } from '../../session/fetchers/callRegApi'
import type { FilingPdf } from '../types/FilingPdf'
import type { RegAttachment } from '../types/RegAttachment'

/** Upload one PDF to `documents/` (multipart field `file`); the answer is the attachment the entry lists. */
export const uploadRegPdf = async (
  client: HttpClient,
  token: string,
  pdf: FilingPdf,
): Promise<RegAttachment> =>
  (await callRegApi(
    client,
    token,
    'documents/',
    buildMultipartBody(
      {},
      {
        field: 'file',
        name: pdf.name,
        type: 'application/pdf',
        bytes: pdf.content,
      },
    ),
  )) as RegAttachment
