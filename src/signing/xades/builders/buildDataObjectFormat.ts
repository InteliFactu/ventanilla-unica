import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignatureContext } from '../types/SignatureContext'
import { buildElement } from './buildElement'
import { buildText } from './buildText'
import { buildTextElement } from './buildTextElement'

/**
 * xades:DataObjectFormat of the signed content in AutoFirma's shape: an empty
 * Description, the ObjectIdentifier when known (with its own empty
 * Description), MimeType, and Encoding (empty unless base64-wrapped).
 */
export const buildDataObjectFormat = (
  context: SignatureContext,
): XmlElement => {
  const { xades } = context.prefixes
  const identifier =
    context.objectIdentifier === undefined
      ? []
      : [
          buildElement(`${xades}:ObjectIdentifier`, {}, [
            buildElement(`${xades}:Identifier`, { Qualifier: 'OIDAsURN' }, [
              buildText(context.objectIdentifier),
            ]),
            buildElement(`${xades}:Description`, {}),
          ]),
        ]
  return buildElement(
    `${xades}:DataObjectFormat`,
    { ObjectReference: `#${context.ids.reference}` },
    [
      buildElement(`${xades}:Description`, {}),
      ...identifier,
      buildTextElement(`${xades}:MimeType`, context.mimeType),
      context.encoding === undefined
        ? buildElement(`${xades}:Encoding`, {})
        : buildTextElement(`${xades}:Encoding`, context.encoding),
    ],
  )
}
