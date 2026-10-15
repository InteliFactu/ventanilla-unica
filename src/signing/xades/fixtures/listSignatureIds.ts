/** The Id of every ds:Signature in a serialised XML, in document order. */
export const listSignatureIds = (xml: Buffer): readonly string[] =>
  [...xml.toString().matchAll(/<ds:Signature [^>]*?Id="([^"]+)"/g)].map(
    (match) => match[1] ?? '',
  )
