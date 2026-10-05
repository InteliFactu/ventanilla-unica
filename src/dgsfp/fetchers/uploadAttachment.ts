import type { HttpClient } from '../../http/types/HttpClient'
import { buildMultipartBody } from '../../sta/registry/builders/buildMultipartBody'
import { dgsfpUrls } from '../session/dgsfpUrls'
import type { DgsfpAttachment } from '../types/DgsfpAttachment'

/**
 * Upload one PDF as the page's FilePond `process` does: a single part named
 * `<control>;#<telematic number>`. The answer is
 * `"TEL43;#<control>_<file name>;#<sha256>"`; the last segment is the key the
 * form stores, and it must be the content's SHA-256 computed beforehand.
 */
export const uploadAttachment = async (
  client: HttpClient,
  numTelematico: string,
  attachment: DgsfpAttachment,
): Promise<void> => {
  const { body, contentType } = buildMultipartBody(
    {},
    {
      field: `${attachment.field};#${numTelematico}`,
      name: attachment.name,
      type: 'application/pdf',
      bytes: attachment.content,
    },
  )
  const response = await client.request(dgsfpUrls.upload, {
    method: 'POST',
    body,
    referer: dgsfpUrls.formPage,
    headers: { 'Content-Type': contentType, Origin: dgsfpUrls.origin },
    timeoutMs: 600_000,
  })
  const key = response.text.replaceAll('"', '').split(';#', 3)[2]
  if (key !== attachment.hash)
    throw new Error(
      `DGSFP: upload of ${attachment.name} answered ${String(response.status)} without its SHA-256`,
    )
}
