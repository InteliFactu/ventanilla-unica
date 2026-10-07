import { randomUUID } from 'node:crypto'
import type { RegistryMultipartBody } from '../types/RegistryMultipartBody'
import type { RegistryMultipartFile } from '../types/RegistryMultipartFile'

/**
 * A `multipart/form-data` body: text parts first, then one file part. Returns
 * the bytes and the content type carrying the boundary.
 */
export const buildMultipartBody = (
  fields: Readonly<Record<string, string>>,
  file: RegistryMultipartFile,
): RegistryMultipartBody => {
  const boundary = `----ventanilla${randomUUID().replaceAll('-', '')}`
  const text = Object.entries(fields)
    .map(
      ([name, value]) =>
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    )
    .join('')
  const head = `${text}--${boundary}\r\nContent-Disposition: form-data; name="${file.field}"; filename="${file.name}"\r\nContent-Type: ${file.type}\r\n\r\n`
  return {
    body: Buffer.concat([
      Buffer.from(head),
      file.bytes,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]),
    contentType: `multipart/form-data; boundary=${boundary}`,
  }
}
