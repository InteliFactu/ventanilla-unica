import type { XmlElement } from '../../xml/types/XmlElement'
import { xadesUris } from '../xadesUris'
import { selectDirectElementPaths } from './selectDirectElementPaths'

/** Match the ds:Signature that actually references the outer signature's value. */
export const selectCounterSignaturePath = (
  property: readonly XmlElement[],
  parentValueId: string,
): readonly XmlElement[] => {
  const signatures = selectDirectElementPaths(
    property,
    'Signature',
    xadesUris.ds,
  )
  const [signature] = signatures
  if (signature === undefined || signatures.length !== 1)
    throw new Error('XAdES CounterSignature has no unique ds:Signature')
  const signedInfo = selectDirectElementPaths(
    signature,
    'SignedInfo',
    xadesUris.ds,
  )
  const references = signedInfo.flatMap((node) =>
    selectDirectElementPaths(node, 'Reference', xadesUris.ds),
  )
  if (
    signedInfo.length !== 1 ||
    !references.some((reference) =>
      reference
        .at(-1)
        ?.attributes.some(
          ({ name, value }) => name === 'URI' && value === `#${parentValueId}`,
        ),
    )
  )
    throw new Error(
      'XAdES CounterSignature does not refer to the parent SignatureValue',
    )
  return signature
}
