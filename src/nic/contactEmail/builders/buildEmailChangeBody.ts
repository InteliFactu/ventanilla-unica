import { randomUUID } from 'node:crypto'

import { emptyFileFields } from '../emptyFileFields'
import type { NicMultipartBody } from '../types/NicMultipartBody'

/**
 * The `multipart/form-data` body of `editarContacto.action`: the text fields
 * in form order, then each file input as an empty part, as a browser sends it.
 */
export const buildEmailChangeBody = (
  fields: Readonly<Record<string, string>>,
): NicMultipartBody => {
  const boundary = `----nic${randomUUID().replaceAll('-', '')}`
  const textParts = Object.entries(fields).map(
    ([name, value]) =>
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
  )
  const fileParts = emptyFileFields.map(
    (name) =>
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n`,
  )
  return {
    body: Buffer.from(
      `${[...textParts, ...fileParts].join('')}--${boundary}--\r\n`,
    ),
    contentType: `multipart/form-data; boundary=${boundary}`,
  }
}
