import type { XmlElement } from '../../xml/types/XmlElement'
import { xadesUris } from '../xadesUris'
import { selectDirectElementPaths } from './selectDirectElementPaths'
import { selectIdOf } from './selectIdOf'

/** Return the Id of the signer's own ds:SignatureValue. */
export const selectXadesSignatureValueId = (
  signature: readonly XmlElement[],
): string => {
  const values = selectDirectElementPaths(
    signature,
    'SignatureValue',
    xadesUris.ds,
  )
  if (values.length !== 1)
    throw new Error('the signature has no unique SignatureValue')
  return selectIdOf(values[0]?.at(-1))
}
