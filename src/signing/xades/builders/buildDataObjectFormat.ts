import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignatureContext } from '../types/SignatureContext'
import { buildElement } from './buildElement'
import { buildText } from './buildText'
import { buildTextElement } from './buildTextElement'

/**
 * xades:DataObjectFormat of the signed content: ObjectIdentifier when given,
 * MimeType, and Encoding for base64-wrapped content, in the schema's order.
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
          ]),
        ]
  const encoding =
    context.encoding === undefined
      ? []
      : [buildTextElement(`${xades}:Encoding`, context.encoding)]
  return buildElement(
    `${xades}:DataObjectFormat`,
    { ObjectReference: `#${context.ids.reference}` },
    [
      ...identifier,
      buildTextElement(`${xades}:MimeType`, context.mimeType),
      ...encoding,
    ],
  )
}
