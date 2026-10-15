import { derContext } from '../../asn1/derContext'
import { derNode } from '../../asn1/derNode'
import { derSequence } from '../../asn1/derSequence'
import { derSetOf } from '../../asn1/derSetOf'
import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { DerElement } from '../../asn1/types/DerElement'

/**
 * The CMS with `attribute` added to the first SignerInfo's unsignedAttrs
 * ([1] IMPLICIT SET OF), every enclosing length re-encoded and nothing
 * signed touched. shortcut: a SignerInfo that already has unsigned
 * attributes is refused; merge them when one does.
 */
export const appendUnsignedAttribute = (
  cms: Buffer,
  attribute: Buffer,
): Buffer => {
  const raw = (element: DerElement): Buffer =>
    cms.subarray(element.start, element.end)
  const [type, wrapper] = readDerChildren(cms, readDerElement(cms, 0))
  const signedData = wrapper && readDerChildren(cms, wrapper)[0]
  const fields = signedData ? readDerChildren(cms, signedData) : []
  const signerSet = fields.at(-1)
  const [signer, ...others] = signerSet ? readDerChildren(cms, signerSet) : []
  if (!type || !signer || others.length > 0)
    throw new Error('a timestamp needs a CMS with exactly one SignerInfo')
  const parts = readDerChildren(cms, signer)
  if (parts.some((part) => part.tag === 0xa1))
    throw new Error('the SignerInfo already has unsigned attributes')
  const stamped = derSequence([...parts.map(raw), derSetOf([attribute], 0xa1)])
  return derSequence([
    raw(type),
    derContext(
      0,
      derSequence([...fields.slice(0, -1).map(raw), derNode(0x31, stamped)]),
    ),
  ])
}
