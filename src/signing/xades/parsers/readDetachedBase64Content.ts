import type { XmlElement } from '../../xml/types/XmlElement'

/** Decode the text of an AutoFirma binary CONTENT wrapper. */
export const readDetachedBase64Content = (element: XmlElement): Buffer => {
  if (element.children.some(({ kind }) => kind === 'element'))
    throw new Error('detached XAdES base64 content contains elements')
  const encoded = element.children
    .map((child) => (child.kind === 'text' ? child.value : ''))
    .join('')
    .replace(/\s/gu, '')
  const data = Buffer.from(encoded, 'base64')
  if (data.toString('base64') !== encoded)
    throw new Error('detached XAdES content is not valid base64')
  return data
}
