/** True when a body starts with the `%PDF-` magic; the sede answers an HTML page with status 200 when it has no document to give. */
export const isPdf = (body: Buffer): boolean =>
  body.subarray(0, 5).equals(Buffer.from('%PDF-'))
