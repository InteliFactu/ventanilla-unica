import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import { buildElement } from './buildElement'
import { buildText } from './buildText'

/**
 * AutoFirma's internally detached layout (`XAdESSigner`, clienteafirma
 * 0d7f3cf): `<AFIRMA Id>` holding `<CONTENT Id MimeType [Encoding]>` with the
 * XML root element (or the bytes in base64), then the signature as a sibling.
 */
export const buildDetachedDocument = (
  context: SignatureContext,
  content: SignedContent,
  signature: XmlElement,
): XmlDocument => {
  const encoding =
    context.encoding === undefined ? {} : { Encoding: context.encoding }
  const data = buildElement(
    'CONTENT',
    {
      Id: context.ids.detachedContent,
      MimeType: context.mimeType,
      ...encoding,
    },
    [
      content.document === undefined
        ? buildText(content.bytes.toString('base64'))
        : content.document.root,
    ],
  )
  const root = buildElement('AFIRMA', { Id: context.ids.detachedRoot }, [
    data,
    signature,
  ])
  return { prolog: [], root, epilog: [] }
}
