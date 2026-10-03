import { encodeLatin1 } from '../../http/encodeLatin1'

/**
 * Re-encode the signed document in ISO-8859-1, the encoding the portal's
 * document declares and AutoFirma keeps on output. Only the serialisation
 * changes: canonicalisation works on characters, so every digest still holds.
 */
export const encodeSignedApplication = (xml: Buffer): Buffer => {
  const declaration = '<?xml version="1.0" encoding="UTF-8"?>'
  const text = xml.toString('utf8')
  if (!text.startsWith(declaration))
    throw new Error('signed XML without the expected declaration')
  return encodeLatin1(
    `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>${text.slice(declaration.length)}`,
  )
}
