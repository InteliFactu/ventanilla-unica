import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import { xadesUris } from '../xadesUris'
import { buildElement } from './buildElement'
import { buildText } from './buildText'

/**
 * The ds:Object an enveloping signature wraps its content in: the XML root
 * element itself (its prolog and epilog are not carried), or the bytes in
 * base64 when the content is not XML.
 */
export const buildContentObject = (
  context: SignatureContext,
  content: SignedContent,
): XmlElement => {
  const name = `${context.prefixes.ds}:Object`
  const id = context.ids.object
  if (content.document !== undefined)
    return buildElement(name, { Id: id, MimeType: context.mimeType }, [
      content.document.root,
    ])
  return buildElement(
    name,
    { Id: id, MimeType: context.mimeType, Encoding: xadesUris.base64 },
    [buildText(content.bytes.toString('base64'))],
  )
}
