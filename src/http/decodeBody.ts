import { inflateUndeclared } from './inflateUndeclared'
import { readCharset } from './readCharset'
import type { DecodedBody } from './types/DecodedBody'

/**
 * Decode a response body: undo compression some portals apply without a
 * `Content-Encoding` header (TGSS), then decode with the declared charset or
 * the caller's default (AEAT answers in ISO-8859-15).
 */
export const decodeBody = (
  raw: Buffer,
  contentType: string | undefined,
  defaultCharset = 'utf-8',
): DecodedBody => {
  const body = inflateUndeclared(raw)
  const charset = readCharset(contentType) ?? defaultCharset
  try {
    return { body, text: new TextDecoder(charset).decode(body) }
  } catch {
    return { body, text: body.toString('utf-8') }
  }
}
